# Trackori Authentication API

## Endpoint

- base url : `TBA`

### Register User

- Path : `/register`
- Method : `POST`
- Response :

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "E6xujuerAYSBucr.............",
    "email": "example@email.com"
  }
}
```

### Login User

- Path : `/login`
- Method : `POST`
- Response :

```json
{
  "success": true,
  "message": "Login Successfully",
  "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "example@email.com",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjF.........."
    }
}
```

### Protected Resources

- Path : `/protected`
- Method : `GET`
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
- Response :

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "uid": "E6xujuerAYSBucr.............",
        "email": "newExample@email.com"
    }
}
```

### Reset User Password

- Path : `/reset-password`
- Method : `POST`
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
