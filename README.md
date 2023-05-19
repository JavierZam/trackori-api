# Trackori Authentication API

## Endpoint

- base url : `TBA`

### Register User

- Path : `/register`
- Method : `POST`
- Request Body :
  - email as `string`
  - password as `string`, must be at least 8 characters long
  - username as `string`
  - weight as `integer`
  - height as `integer`
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

### Protected Resources

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

### User Info

- Path : `/user{uid}`
- Method : `GET`
- Response :

```json
{
    "success": true,
    "message": "Success fetching user data",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "example@email.comm"
    }
}
```

### Edit User Info

- Path : `/edit-profile/{uid}`
- Method : `PUT`
- Parameters :
  - User Id as `string`
- Request Body :
  - email as `string`, optional
  - password as `string`, optional
  - username as `string`, optional
  - weight as `integer`, optional
  - height as `integer`, optional
  - currentEmail as `string`, required
  - currentPassword as `string`, required
- Response :

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "newExample@email.com"
        "username": "newUsernameExample"
    }
}
```

### Reset User Password

- Path : `/reset-password`
- Method : `POST`
- Request Body :
  - email as `string`, required
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
