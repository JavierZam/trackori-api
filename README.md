# Trackori Backend API

![User Api](https://github.com/C23-PS317/trackori-backend-api/blob/main/userapiimg.png?raw=true)

## Endpoint
| Endpoint                                             | Method| Description                             |
| ---------------------------------------------------- | ----- | --------------------------------------- |
| `/register`                                          | `POST`| Register new user                       |
| `/login`                                             | `POST`| User login                              |
| `/users/{uid}/calorie-history`                       | `POST`| Create new data in calorie-history      |
| `/users/{uid}/get-calorie-history?date={YYYY-MM-DD}` | `GET` | Get calorie-history data by date        |
| `/users/{uid}/all-calorie-history`                   | `GET` | Get all calorie-history data            |
| `/users/{uid}/calorie-history/{docId}`               | `PUT` | Edit calorie-history data               |
| `/edit-info/{uid}`                                   | `PUT` | Edit user information                   |
| `/protected`                                         | `GET` | Verify user token (protected resources) |
| `/user/{uid}`                                        | `GET` | Get user info by uid                    |
| `/edit-credential/{uid}`                             | `PUT` | Edit user credential (email or password)|
| `/reset-password`                                    | `POST`| Reset user password                     |
| `/logout`                                            | `POST`| User logout                             |
| `/users/{uid}/all-foods-history`                     | `GET` | Get all data in foods-history           |
| `/users/{uid}/foods-history/{docId}`                 | `GET` | Get data in foods-history by id         |
| `/foods`                                             | `GET` | Get all data in foods collection        |
| `/foods/{docId}`                                     | `GET` | Get data in foods collection by id      |

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
  - portion as `number`
  - unit as `string`
- Response :

```json
{
    "success": true,
    "message": "Successfully add new calorie history data",
    "data": {
        "id": "Lf2xQ5j8G7X57HO8eIie",
        "name": "burger",
        "calories": 300,
        "portion": 0.5,
        "unit": "100 gram",
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
            "calories": 3,
            "portion": 2,
            "unit": "butir"
        },
        {
            "id": "Pw0CSSstfUO7pb0OmLyh",
            "date": "DD-MM-YYYY",
            "name": "es_campur",
            "calories": 250,
            "portion": 1,
            "unit": "porsi"
        },
        {
            "id": "Lf2xQ5j8G7X57HO8eIie",
            "date": "DD-MM-YYYY",
            "name": "burger",
            "calories": 300,
            "portion": 1,
            "unit": "buah"
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
            "calories": 3,
            "portion": 2,
            "unit": "butir"
        },
        {
            "id": "Pw0CSSstfUO7pb0OmLyh",
            "date": "DD-MM-YYYY",
            "name": "es_campur",
            "calories": 250,
            "portion": 1,
            "unit": "porsi"
        },
        {
            "id": "Lf2xQ5j8G7X57HO8eIie",
            "date": "DD-MM-YYYY",
            "name": "burger",
            "calories": 300,
            "portion": 1,
            "unit": "buah"
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
  - portion as `number` (optional)
  - unit as `string` (optional)
- Response :

```json
{
    "success": true,
    "message": "Successfully updated calorie history",
    "data": {
        "portion": 3,
        "calories": 250,
        "unit": "buah",
        "date": "14-06-2023",
        "name": "burger"
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
### Get user info by uid

- Path : `/user/{uid}`
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
        "gender": "male",
        "age": "21",
        "weight": "60",
        "height": "165"
        "dailyCalorieNeeds": 2000
        "plan": "defisit", if plan exist
        "dailyCalorieNeeds": 2000
        "plan": "defisit", if plan exist
    }
}
```

### Edit User Credential, email or password
### Edit User Credential, email or password

- Path : `/edit-credential/{uid}`
- Path : `/edit-credential/{uid}`
- Method : `PUT`
- Request Body :
  - email as `string` (optional), new email
  - password as `string` (optional), new password
  - currentEmail as `string` (required), old email
  - currentPassword as `string` (required), old password
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
        "email": "newExample@email.com",
    }
}
```

### Reset User Password

- Path : `/reset-password`
- Method : `POST`
- Request Body :
  - email as `string`
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
            "id": "2ohBGCNRFDZBNxvlKbGO",
            "satuan": "butir",
            "image_user": "https://storage.googleapis.com/foods-image/41OD8U1Tn0N3GC2VMkVH5HnFf2r2/tempe_goreng%20%284%29.jpg",
            "image_db": "https://storage.googleapis.com/foods-image/foods/telur_balado%20(1).jpg",
            "kalori": 71,
            "nama": "telur_balado"
        },
        {
            "id": "Apuwf7tGQqVvM7YTPK01",
            "kalori": 0,
            "nama": "air",
            "image_user": "https://storage.googleapis.com/foods-image/41OD8U1Tn0N3GC2VMkVH5HnFf2r2/air_train%20%282%29.jpg",
            "satuan": "ml",
            "image_db": "https://storage.googleapis.com/foods-image/foods/air_train%20(6).jpg"
        },
        {
            "id": "YRtXArfXoWX7rus59d12",
            "satuan": "ml",
            "image_db": "https://storage.googleapis.com/foods-image/foods/air_train%20(6).jpg",
            "image_user": "https://storage.googleapis.com/foods-image/41OD8U1Tn0N3GC2VMkVH5HnFf2r2/air_train%20%283%29.jpg",
            "nama": "air",
            "kalori": 0
        },
        {
            "id": "vWoAGAn6QokKxV415QR5",
            "image_db": "https://storage.googleapis.com/foods-image/foods/telur_balado%20(1).jpg",
            "satuan": "butir",
            "image_user": "https://storage.googleapis.com/foods-image/41OD8U1Tn0N3GC2VMkVH5HnFf2r2/tempe_goreng%20%284%29.jpg",
            "nama": "telur_balado",
            "kalori": 71
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
        "id": "Apuwf7tGQqVvM7YTPK01",
        "nama": "air",
        "kalori": 0,
        "image_db": "https://storage.googleapis.com/foods-image/foods/air_train%20(6).jpg",
        "satuan": "ml",
        "image_user": "https://storage.googleapis.com/foods-image/41OD8U1Tn0N3GC2VMkVH5HnFf2r2/air_train%20%282%29.jpg"
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
            "image_db": "https://storage.googleapis.com/foods-image/foods/air_train%20(6).jpg",
            "nama": "air",
            "kalori": 0
        },
        {
            "id": "anggur",
            "nama": "anggur",
            "image_db": "https://storage.googleapis.com/foods-image/foods/anggur%20(1).jpg",
            "satuan": "butir",
            "kalori": 3
        },
        {
            "id": "apel",
            "satuan": "buah",
            "image_db": "https://storage.googleapis.com/foods-image/foods/apel_train%20(3).jpg",
            "kalori": 72,
            "nama": "apel"
        },
        {
            "id": "ayam_goreng",
            "image_db": "https://storage.googleapis.com/foods-image/foods/ayam_train%20(11)%20(1).jpg",
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
        "satuan": "ml",
        "image_db": "https://storage.googleapis.com/foods-image/foods/air_train%20(6).jpg"
    }
}
```
