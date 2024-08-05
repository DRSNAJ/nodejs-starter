# NodeJS Starter Project

This project will create a simple user account system.

---

## Features

- **User Signup:**
    - Allow users to sign up by creating a username and password.
- **User Login:**
    - Allow users to login by passing back a JWT Token using PassportJS.
- **Update User Information:**
    - Once authorized, allow users to update their information.
- **Get User Information:**
    - Allows users to get their information once authorized.

## Tech Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: Passport.js with JWT strategy

## API Endpoints

1. User Sign-up
    - **Endpoint**: /api/signup
    - **Method**: POST
    - **Request Body**:
        - username
        - password
2. User Login
    - **Endpoint**: /api/login
    - **Method**: POST
    - **Request Body**:
        - username
        - password
    - **Response**: JWT token
3. Update User Information
    - **Endpoint**: /api/user
    - **Method**: PUT
    - **Request Body**:
        - username
        - password
4. Get User Information
    - **Endpoint**: /api/user
    - **Method**: GET
    - **Response**:
        - username
        - password

---

### Resources

[Express](https://www.notion.so/Express-5dff6dfd501b49d1bad9cb0f37c3de38?pvs=21)

- https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs
- [Randike — Excalidraw Plus](https://app.excalidraw.com/l/64VxMbhn1JT/24LXtjp4Na2)
- [PUT Vs PATCH](https://www.notion.so/PUT-Vs-PATCH-c488f594208745378dc607df4cb48b5b?pvs=21)
- [Easy Steps to Set Up TypeScript with Node.js and Express | by Evelyn Taylor | Medium](https://medium.com/@Evelyn.Taylor/easy-steps-to-set-up-typescript-with-node-js-and-express-4264eaf40351)
