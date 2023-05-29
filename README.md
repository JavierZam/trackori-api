# Trackori Authentication API

## Endpoint

- base url : https://trackori-authentication-api-ymrdyfncwq-et.a.run.app/

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
  - calories as `number`
- Response :

```json
{
  "success": true,
  "message": "Successfully add calorie history data",
  "data": {
      "calories": 100,
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
  "message": "Succesfully fetching calories data by date",
  "data": [
      {
          "id": "ruFG4GsQtc......",
          "calories": 100,
          "date": "DD-MM-YYYY"
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
          "id": "ruFG4GsQtc......",
          "calories": 100,
          "date": "DD-MM-YYYY"
      },
      {
          "id": "ruFGB4rtc......",
          "calories": 200,
          "date": "DD-MM-YYYY"
      },
   ]
}
```

### Edit calorie-history data

- Path : `/users/{uid}/calorie-history/{docId}`
- Method : `PUT`
- Request Body :
  - calories as `number`
- Response :

```json
{
  "success": true,
  "message": "Successfully updated calorie history",
  "data": {
          "calories": 300,
          "date": "DD-MM-YYYY"
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

- Path : `/user{uid}`
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
