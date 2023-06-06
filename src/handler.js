const { initializeApp, getApps, getApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, sendPasswordResetEmail, isSignInWithEmailLink } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } = require('firebase/firestore');
const Boom = require('@hapi/boom');
const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');

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

const saveTokenToDatabase = async (uid, token) => {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, { token: token });
};

const getTokenFromDatabase = async (uid) => {
  const userDoc = doc(db, 'users', uid);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    return userData.token;
  }
  return null;
};

const refreshAccessToken = async (uid) => {
  // Simulasi pengambilan refresh token dari database atau sesi server
  const refreshToken = await getTokenFromDatabase(uid);

  // Simulasi pembaruan access token menggunakan refresh token
  const refreshedToken = await refreshAccessTokenWithRefreshToken(refreshToken);

  // Simpan access token yang baru di database atau sesi server
  await saveTokenToDatabase(uid, refreshedToken);

  return refreshedToken;
};

// Fungsi untuk memperbarui access token menggunakan refresh token (implementasi sesuai kebutuhan)
const refreshAccessTokenWithRefreshToken = async (refreshToken) => {
  // Implementasi pembaruan access token dengan menggunakan refresh token
  // ...
  // return token yang baru diperbarui
};

//User Register
const registerHandler = async (request, h) => {
  const { email, password, username, weight, height } = request.payload;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      email,
      username,
      weight,
      height,
    });

    // Create 'foods' subcollection inside 'users' document
    const foodsCollection = collection(db, 'users', user.uid, 'foods-history');
    const newFoodDoc = doc(foodsCollection);
    await setDoc(newFoodDoc, {
      // userID: user.uid
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
    const idToken = await user.getIdToken();

    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    let username = null;
    if (docSnap.exists()) {
      username = docSnap.data().username;
    }

    // Simpan access token ke database atau sesi server
    await saveTokenToDatabase(user.uid, idToken);

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

//Verifying User TokenId
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

//User Logout
const logoutHandler = async (request, h) => {
  try {
    await signOut(auth);

    // Menghapus access token dari database atau sesi server saat logout
    await saveTokenToDatabase(request.user.uid, null);

    return h.response({ success: true, message: 'Logged out successfully' }).code(200);
  } catch (error) {
    console.error('Error logging out user:', error);
    return h.response({ success: false, message: 'Something went wrong' }).code(400);
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
      return h.response({ success: true, message: 'Success fetching user data', data: { uid: uid, email: data.email, username: data.username, weight: data.weight, height: data.height } }).code(200);
    } else {
      return h.response({ success: false, message: 'User not found' }).code(404);
    }
  } catch (error) {
    console.error({ success: false, message: 'Error fetching user data:', error });
    return h.response({ success: false, message: 'Error fetching user data' }).code(500);
  }
};

//Edit User Data, email and password
const editUserDataHandler = async (request, h) => {
  const { uid } = request.params;
  const { email, password, username, weight, height, currentEmail, currentPassword } = request.payload;

  try {
    const { user } = await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

    // Compare the user's UID with the provided UID
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
      const updateData = {};
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (weight) updateData.weight = weight;
      if (height) updateData.height = height;

      await updateDoc(userDoc, updateData);

      // Update user data
      if (email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);

      return h.response({ success: true, message: 'Profile updated successfully', data: { uid: uid, email: email, username: username, weight: weight, height: height } }).code(200);
    } else {
      // The signed-in user's UID does not match the provided UID
      return h.response({ success: false, message: "You don't have permission to edit this account" }).code(403);
    }
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error.code === 'auth/user-not-found') {
      return h.response({ success: false, message: 'User not found' }).code(400);
    } else {
      throw error;
    }
  }
};

//Reset User Password
const resetPasswordHandler = async (request, h) => {
  const { email } = request.payload;
  try {
    await sendPasswordResetEmail(auth, email);
    console.log({ success: true, message: 'Password reset email sent to:', email });
    return h.response({ success: true, message: 'We have sent email to reset your password', data: { email: email } }).code(200);
  } catch (error) {
    console.log({ success: false, message: 'Error sending password reset email:', error });

    if (error.code === 'auth/user-not-found') {
      // Handle email already in use error
      return h.response({ success: false, message: 'User not found' }).code(404);
    } else {
      throw error;
    }
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  verifyTokenHandler,
  logoutHandler,
  getUserByIdHandler,
  editUserDataHandler,
  resetPasswordHandler,
};
