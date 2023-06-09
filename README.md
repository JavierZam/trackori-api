![User Api](https://github.com/C23-PS317/trackori-authentication-api/assets/69651946/e532f953-410d-4a8d-a491-a0670e0bd7f5)

# Trackori Authentication API

## Endpoint

### Register User

- Path : `/register`
- Method : `POST`
- Request Body :
  - email as `string`
  - password as `string`, min 8 characters
  - username as `string`, min 3 characters
  - gender as `string`, male or female
  - age as `number`
  - weight as `number`
  - height as `number`
  - plan as `string`, defisit, bulking or null 
- Response :

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "E6xujuerAYSBucr.............",
    "email": "example@email.com",
    "username": "example"
  }
}
```

### Login User

- Path : `/login`
- Method : `POST`
- Request Body :
  - email as `string`
  - password as `string`
- Response :

```json
{
  "success": true,
  "message": "Login Successfully",
  "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "example@email.com",
        "username": "example",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjF.........."
    }
}
```

### Create new data in calorie-history

- Path : `/users/{uid}/calorie-history`
- Method : `POST`
- Request Body :
  - name as `string` 
  - calories as `number`
- Response :

```json
{
    "success": true,
    "message": "Successfully add new calorie history data",
    "data": {
        "id": "Lf2xQ5j8G7X57HO8eIie",
        "name": "burger",
        "calories": 300,
        "date": "DD-MM-YYYY"
    }
}
```

### Get calorie-history data by date

- Path : `/users/{uid}/get-calorie-history?date={YYYY-MM-DD}`
- Method : `GET`
- Parameters :
  - date as `YYYY-MM-DD` format
- Response :

```json
{
    "success": true,
    "message": "Successfully fetching calorie history data by date",
    "data": [
        {
            "id": "yaVmUpLcVJ3AX1XoCwLg",
            "date": "DD-MM-YYYY",
            "name": "anggur",
            "calories": 3
        },
        {
            "id": "Pw0CSSstfUO7pb0OmLyh",
            "date": "DD-MM-YYYY",
            "name": "es_campur",
            "calories": 250
        },
        {
            "id": "Lf2xQ5j8G7X57HO8eIie",
            "date": "DD-MM-YYYY",
            "name": "burger",
            "calories": 300
        }
    ]
}
```

### Get all calorie-history data

- Path : `/users/{uid}/all-calorie-history`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Succesfully fetching all calorie history data",
    "data": [
        {
            "id": "yaVmUpLcVJ3AX1XoCwLg",
            "date": "DD-MM-YYYY",
            "name": "anggur",
            "calories": 3
        },
        {
            "id": "Pw0CSSstfUO7pb0OmLyh",
            "date": "DD-MM-YYYY",
            "name": "es_campur",
            "calories": 250
        },
        {
            "id": "Lf2xQ5j8G7X57HO8eIie",
            "date": "DD-MM-YYYY",
            "name": "burger",
            "calories": 300
        }
    ]
}
```

### Edit calorie-history data

- Path : `/users/{uid}/calorie-history/{docId}`
- Method : `PUT`
- Request Body :
  - name as `string` (optional)
  - calories as `number` (optional)
- Response :

```json
{
    "success": true,
    "message": "Successfully updated calorie history",
    "data": {
        "name": "burger",
        "date": "DD-MM-YYYY",
        "calories": 300
    }
}
```

### Edit User Information

- Path : `/edit-info/{uid}`
- Method : `PUT`
- Request Body :
  - username as `string` (optional), min 3 characters
  - age as `number` (optional)
  - weight as `number` (optional)
  - height as `number` (optional)
  - dailyCalorieNeeds as `number` (optional)
  - plan as `string`, defisit, bulking or null 
- Response :

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "username": "newUsernameExample",
        "gender": "male",
        "age": "21",
        "weight": "60",
        "height": "165"
        "dailyCalorieNeeds": 2000
        "plan": "defisit", if plan exist
    }
}
```

### Protected Resources, verifying user token

- Path : `/protected`
- Method : `GET`
- Headers :
  - Authorization: `Token`
- Response :

```json
{
  "success": true,
  "message": "This is protected resources"
}
```

### Get user info by uid

- Path : `/user/{uid}`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Success fetching user data",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "example@email.com",
        "username": "example",
        "gender": "male",
        "age": "21",
        "weight": "60",
        "height": "165"
        "dailyCalorieNeeds": 2000
        "plan": "defisit", if plan exist
    }
}
```

### Edit User Credential, email or password

- Path : `/edit-credential/{uid}`
- Method : `PUT`
- Request Body :
  - email as `string` (optional), new email
  - password as `string` (optional), new password
  - currentEmail as `string` (required), old email
  - currentPassword as `string` (required), old password
- Response :

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "newExample@email.com",
    }
}
```

### Reset User Password

- Path : `/reset-password`
- Method : `POST`
- Request Body :
  - email as `string`
- Response :

```json
{
    "success": true,
    "message": "We have sent email to reset your password",
    "data": {
        "email": "example@email.comm"
    }
}
```

### User Logout

- Path : `/logout`
- Method : `POST`
- Response :

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### Get all data in foods-history

- Path : `/users/{uid}/all-foods-history`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Successfully fetching all foods history data",
    "data": [
        {
            "id": "Yw358lmHecym3QwVUlKQ",
            "kalori": 0,
            "nama": "air",
            "image_url": "https://storage.googleapis.com/foods-image/5TcC8rY4L7VsSR2lWAZiVnDDSgy2/Yw358lmHecym3QwVUlKQ",
            "satuan": "ml"
        },
        {
            "id": "klB7T8zGQQl7RbdQRTSs"
        },
        {
            "id": "uZBE9cL6hr7Wk8BO46DD",
            "kalori": 125,
            "satuan": "100 gram",
            "nama": "cumi_goreng_tepung",
            "image_url": "https://storage.googleapis.com/foods-image/5TcC8rY4L7VsSR2lWAZiVnDDSgy2/uZBE9cL6hr7Wk8BO46DD"
        },
        {
            "id": "zcdXvuKwoOWAwSP4BSfW",
            "satuan": "butir",
            "image_url": "https://storage.googleapis.com/foods-image/5TcC8rY4L7VsSR2lWAZiVnDDSgy2/zcdXvuKwoOWAwSP4BSfW",
            "kalori": 71,
            "nama": "telur_balado"
        }
    ]
}
```

### Get data in foods-history by id

- Path : `/users/{uid}/foods-history/{docId}`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Successfully fetching the food history data",
    "data": {
        "id": "Yw358lmHecym3QwVUlKQ",
        "satuan": "ml",
        "image_url": "https://storage.googleapis.com/foods-image/5TcC8rY4L7VsSR2lWAZiVnDDSgy2/Yw358lmHecym3QwVUlKQ",
        "kalori": 0,
        "nama": "air"
    }
}
```

### Get all data in foods collection

- Path : `/foods`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Successfully fetching all foods data",
    "data": [
        {
            "id": "air",
            "satuan": "ml",
            "nama": "air",
            "kalori": 0
        },
        {
            "id": "anggur",
            "nama": "anggur",
            "satuan": "butir",
            "kalori": 3
        },
        {
            "id": "apel",
            "satuan": "buah",
            "kalori": 72,
            "nama": "apel"
        },
        {
            "id": "ayam_goreng",
            "nama": "ayam goreng",
            "satuan": "100 gram",
            "kalori": 260
        },
        ......
    ]
}
```

### Get data in foods collection by id

- Path : `/foods/{docId}`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Successfully fetching food data",
    "data": {
        "id": "air",
        "nama": "air",
        "kalori": 0,
        "satuan": "ml"
    }
}
```
