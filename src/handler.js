const { initializeApp, getApps, getApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, sendPasswordResetEmail } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, Timestamp, deleteField, orderBy } = require('firebase/firestore');
const Boom = require('@hapi/boom');
const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');
const { date } = require('joi');

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

//User Register
const registerHandler = async (request, h) => {
  const { email, password, username, gender, age, weight, height, plan } = request.payload;

  // Calculate BMR (Basal Metabolic Rate) and daily calorie needs
  let BMR;
  if (gender === 'male') {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  // assume for moderate physical activity
  let dailyCalorieNeeds = BMR * 1.55;
  dailyCalorieNeeds = Math.round(dailyCalorieNeeds);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = doc(db, 'users', user.uid);
    let userData = {
      email,
      username,
      gender,
      age,
      weight,
      height,
      dailyCalorieNeeds,
    };
    if (plan) {
      userData.plan = plan;
    }
    await setDoc(userDoc, userData);

    // Create 'foods-history' subcollection inside 'users' document
    const foodsCollection = collection(db, 'users', user.uid, 'foods-history');
    const newFoodDoc = doc(foodsCollection);
    await setDoc(newFoodDoc, {
      // userID: user.uid
    });

    // Create 'calorie-history' subcollection inside 'users' document
    const caloriHistory = collection(db, 'users', user.uid, 'calorie-history');
    const newCalorieDocs = doc(caloriHistory);
    await setDoc(newCalorieDocs, {
      calories: 0,
      date: Timestamp.now(),
    });

    return h.response({ success: true, message: 'User registered successfully', data: { uid: user.uid, email: user.email, username: username } }).code(201);
  } catch (error) {
    console.error({ success: false, message: 'Something went wrong:', error });

    if (error.code === 'auth/email-already-in-use') {
      // Handle email already in use error
      return h.response({ success: false, message: 'That email is already taken' }).code(400);
    } else {
      throw error;
    }
  }
};

//User Login
const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Get token
    const idToken = await user.getIdToken();

    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    let username = null;
    if (docSnap.exists()) {
      username = docSnap.data().username;
    }

    return h.response({ success: true, message: 'Login Successfully', data: { uid: user.uid, email: user.email, username: username, accessToken: idToken } }).code(200);
  } catch (error) {
    console.error('Error logging in user:', error);

    if (error.code === 'auth/user-not-found') {
      return h.response({ success: false, message: 'User not found' }).code(400);
    } else if (error.code === 'auth/wrong-password') {
      return h.response({ success: false, message: 'Email and password does not match' }).code(401);
    } else {
      throw error;
    }
  }
};

// Create new document in calorie-history subcollection
const addCalorieHistoryHandler = async (request, h) => {
  const { uid } = request.params;
  const { calories } = request.payload;

  try {
    const userDoc = doc(db, 'users', uid);
    const calorieHistoryCollection = collection(userDoc, 'calorie-history');
    const calorieHistoryDoc = doc(calorieHistoryCollection);
    const dateNow = Timestamp.now();
    await setDoc(calorieHistoryDoc, {
      calories,
      date: dateNow,
    });
    const dateObj = dateNow.toDate();
    // Format the date to 'DD-MM-YYYY'
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
    return h.response({ success: true, message: 'Successfully add new calorie history data', data: { calories: calories, date: formattedDate } }).code(201);
  } catch (error) {
    console.error('Error add calorie history data:', error);
    return h.response({ success: false, message: 'Error add calorie history data' }).code(500);
  }
};

// Get data from calorie-history subcollection by date
const getCalorieHistoryByDateHandler = async (request, h) => {
  const { uid } = request.params;
  const { date } = request.query;

  try {
    const userDoc = doc(db, 'users', uid);
    const calorieHistoryCollection = collection(userDoc, 'calorie-history');
    // Start the date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    // End the date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // Query documents with start date
    const startQuery = query(calorieHistoryCollection, where('date', '>=', Timestamp.fromDate(startDate)));
    // Query documents with end date
    const endQuery = query(calorieHistoryCollection, where('date', '<', Timestamp.fromDate(endDate)));

    const startSnapshot = await getDocs(startQuery);
    const endSnapshot = await getDocs(endQuery);

    // Get calorie and date data
    // const startData = startSnapshot.docs.map(doc => ({ id: doc.id, calories: doc.data().calories, date: doc.data().date.toDate().toISOString() }));
    const startData = startSnapshot.docs.map((doc) => {
      const dateObj = doc.data().date.toDate();
      // Format the date to 'DD-MM-YYYY'
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
      return { id: doc.id, calories: doc.data().calories, date: formattedDate };
    });
    const endData = endSnapshot.docs.map((doc) => doc.id);
    const data = startData.filter((doc) => endData.includes(doc.id));

    return h.response({ success: true, message: 'Succesfully fetching calories data by date', data: data }).code(200);
  } catch (error) {
    console.error('Error fetching calorie-history data:', error);
    return h.response({ success: false, message: 'Error fetching calorie-history data' }).code(500);
  }
};

// Get all data from calorie-history subcollection
const getAllCalorieHistoryHandler = async (request, h) => {
  const { uid } = request.params;

  try {
    const userDoc = doc(db, 'users', uid);
    const calorieHistoryCollection = collection(userDoc, 'calorie-history');

    // Show data from newest by date
    const q = query(calorieHistoryCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      const dateObj = docData.date.toDate();
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
      return {
        id: doc.id,
        date: formattedDate,
        calories: docData.calories,
      };
    });

    return h.response({ success: true, message: 'Succesfully fetching all calorie history data', data: data }).code(200);
  } catch (error) {
    console.error('Error getting calorie history:', error);
    return h.response({ success: false, message: 'Error getting calorie history' }).code(500);
  }
};

// Edit data in calorie-history subcollection
const editCalorieHistoryHandler = async (request, h) => {
  const { uid, docId } = request.params;
  const { calories } = request.payload;

  try {
    const userDoc = doc(db, 'users', uid);
    const calorieHistoryDoc = doc(userDoc, 'calorie-history', docId);
    await updateDoc(calorieHistoryDoc, { calories });

    const updatedDoc = await getDoc(calorieHistoryDoc);
    if (!updatedDoc.exists()) {
      // Handle error: document doesn't exist
      console.error('Document does not exist:', docId);
      return h.response({ success: false, message: 'Document does not exist' }).code(404);
    }
    const updatedData = updatedDoc.data();
    const dateObj = updatedData.date.toDate();
    // Format the date to 'DD-MM-YYYY'
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;

    return h.response({ success: true, message: 'Successfully updated calorie history', data: { calories: calories, date: formattedDate } }).code(200);
  } catch (error) {
    console.error('Error updating calorie history:', error);
    return h.response({ success: false, message: 'Error updating calorie history' }).code(500);
  }
};

// Edit User Information
const editUserInfoHandler = async (request, h) => {
  const { uid } = request.params;
  const { username, age, weight, height, dailyCalorieNeeds, plan } = request.payload;

  try {
    // Fetch user data from Firestore
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      return h.response({ success: false, message: 'User not found' }).code(404);
    }

    let updateInfo = docSnap.data();
    const gender = updateInfo.gender;
    if (username) updateInfo.username = username;
    if (age) updateInfo.age = age;
    if (gender) updateInfo.gender = gender;
    if (weight) updateInfo.weight = weight;
    if (height) updateInfo.height = height;
    if (dailyCalorieNeeds) updateInfo.dailyCalorieNeeds = dailyCalorieNeeds;
    if (plan !== undefined) updateInfo.plan = plan;

    // delete plan if plan is null
    if (plan === null) {
      await updateDoc(userDoc, { plan: deleteField() });
      delete updateInfo.plan;
    }

    // if dailyCalorieNeeds is not provided by user
    if (!dailyCalorieNeeds) {
      // Calculate BMR (Basal Metabolic Rate) and daily calorie needs
      let BMR;
      if (updateInfo.gender === 'male') {
        BMR = 10 * updateInfo.weight + 6.25 * updateInfo.height - 5 * updateInfo.age + 5;
      } else {
        BMR = 10 * updateInfo.weight + 6.25 * updateInfo.height - 5 * updateInfo.age - 161;
      }
      // assuming for moderate physical activity
      let dailyCalorieNeeds = BMR * 1.55;
      dailyCalorieNeeds = Math.round(dailyCalorieNeeds);
      updateInfo.dailyCalorieNeeds = dailyCalorieNeeds;
    }

    // Update user data
    await updateDoc(userDoc, updateInfo);

    return h
      .response({
        success: true,
        message: 'Profile updated successfully',
        data: { uid: uid, username: updateInfo.username, gender: updateInfo.gender, age: updateInfo.age, weight: updateInfo.weight, height: updateInfo.height, dailyCalorieNeeds: updateInfo.dailyCalorieNeeds, plan: updateInfo.plan },
      })
      .code(200);
  } catch (error) {
    console.error('Error updating profile:', error);
    return h.response({ success: false, message: 'Error updating user information' });
  }
};

//Verifying User Token
const verifyTokenHandler = async (request, h) => {
  const idToken = request.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log({ success: true, message: 'Token is valid' });
    request.user = decodedToken;
    return h.continue;
  } catch (error) {
    console.error({ success: false, message: 'Error verifying token', error });
    throw Boom.unauthorized('Invalid token');
  }
};

//Get User Info By Id
const getUserByIdHandler = async (request, h) => {
  const { uid } = request.params;

  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return h
        .response({
          success: true,
          message: 'Success fetching user data',
          data: { uid: uid, email: data.email, username: data.username, gender: data.gender, age: data.age, weight: data.weight, height: data.height, dailyCalorieNeeds: data.dailyCalorieNeeds, plan: data.plan },
        })
        .code(200);
    } else {
      return h.response({ success: false, message: 'User not found' }).code(404);
    }
  } catch (error) {
    console.error({ success: false, message: 'Error fetching user data:', error });
    return h.response({ success: false, message: 'Error fetching user data' }).code(500);
  }
};

//Edit user credential, email or password
const editUserDataHandler = async (request, h) => {
  const { uid } = request.params;
  const { email, password, currentEmail, currentPassword } = request.payload;

  try {
    const { user } = await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

    if (user.uid === uid) {
      if (email && email !== currentEmail) {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return h.response({ success: false, message: 'That email is already taken' }).code(400);
        }
      }

      // Update user data in Firestore
      const userDoc = doc(db, 'users', uid);
      const docSnap = await getDoc(userDoc);
      let updateData = docSnap.data();
      // const updateData = {};
      if (email) updateData.email = email;

      await updateDoc(userDoc, updateData);

      // Update user data
      if (email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);

      return h.response({ success: true, message: 'Profile updated successfully', data: { uid: uid, email: updateData.email } }).code(200);
    } else {
      // The signed-in user's UID does not match the provided UID
      return h.response({ success: false, message: "Signed-in user's UID does not match the provided UID" }).code(403);
    }
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error.code === 'auth/user-not-found') {
      return h.response({ success: false, message: 'User not found' }).code(400);
    } else if (error.code === 'auth/wrong-password') {
      return h.response({ success: false, message: 'Email and password does not match' }).code(401);
    } else {
      throw error;
    }
  }
};

//Reset user password using email
const resetPasswordHandler = async (request, h) => {
  const { email } = request.payload;
  try {
    await sendPasswordResetEmail(auth, email);
    console.log({ success: true, message: 'Password reset email sent to:', email });
    return h.response({ success: true, message: 'We have sent email to reset your password', data: { email: email } }).code(200);
  } catch (error) {
    console.log({ success: false, message: 'Error sending password reset email:', error });

    if (error.code === 'auth/user-not-found') {
      return h.response({ success: false, message: 'User not found' }).code(404);
    } else {
      throw error;
    }
  }
};

//User Logout
const logoutHandler = async (request, h) => {
  try {
    await signOut(auth);
    return h.response({ success: true, message: 'Logged out successfully' }).code(200);
  } catch (error) {
    console.error('Error logging out user:', error);
    return h.response({ success: false, message: 'Something went wrong' }).code(400);
  }
};

const addAllCalorieHistoryHandler = async (request, h) => {
  const { calories } = request.payload;

  try {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);

    // Add new document to 'calorie-history' subcollection for each user
    for (const userDoc of userSnapshot.docs) {
      const uid = userDoc.id;
      const userRef = doc(db, 'users', uid);
      const calorieHistoryCollection = collection(userRef, 'calorie-history');
      const calorieHistoryDoc = doc(calorieHistoryCollection);
      const dateNow = Timestamp.now();
      await setDoc(calorieHistoryDoc, {
        calories,
        date: dateNow,
      });
    }

    return h.response({ success: true, message: 'Successfully added calorie history data for all users', data: { calories: calories } }).code(201);
  } catch (error) {
    console.error('Error adding calorie history data:', error);
    return h.response({ message: 'Error adding calorie history data', error: error.toString() }).code(500);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  addCalorieHistoryHandler,
  getCalorieHistoryByDateHandler,
  getAllCalorieHistoryHandler,
  editCalorieHistoryHandler,
  editUserInfoHandler,
  verifyTokenHandler,
  getUserByIdHandler,
  editUserDataHandler,
  resetPasswordHandler,
  logoutHandler,
  addAllCalorieHistoryHandler,
};
