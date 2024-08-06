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
    - **Endpoint**: `/signup`
    - **Method**: POST
    - **Request Body**:
        - username
        - password
2. User Login
    - **Endpoint**: `/login`
    - **Method**: POST
    - **Request Body**:
        - username
        - password
    - **Response**: JWT token
3. Update User Information
    - **Endpoint**: `/user/:userId` (Authorized Endpoint)
    - **Method**: PUT
    - **Request Body**:
        - username
        - password
4. Get User Information
    - **Endpoint**: `/user/:userId` (Authorized Endpoint)
    - **Method**: GET
    - **Response**:
        - username
        - password

---

### Notes

[Hashing and Salting](https://www.notion.so/Hashing-and-Salting-9567e541bd1b45aaa76fe7e71d478bda?pvs=21)

[Express](https://www.notion.so/Express-5dff6dfd501b49d1bad9cb0f37c3de38?pvs=21)

### Resources

- https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs
- [Randike — Excalidraw Plus](https://app.excalidraw.com/l/64VxMbhn1JT/24LXtjp4Na2)
- [PUT Vs PATCH](https://www.notion.so/PUT-Vs-PATCH-c488f594208745378dc607df4cb48b5b?pvs=21)
- [Easy Steps to Set Up TypeScript with Node.js and Express | by Evelyn Taylor | Medium](https://medium.com/@Evelyn.Taylor/easy-steps-to-set-up-typescript-with-node-js-and-express-4264eaf40351)
- [How to Hash Passwords with bcrypt in Node.js (freecodecamp.org)](https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/)
- [Passport JWT and Session Authentication Tutorial (fullstackfoundations.com)](https://www.fullstackfoundations.com/blog/passport-jwt)
- https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
- https://medium.com/nerd-for-tech/understanding-routing-in-express-js-as-simple-as-possible-45b4a852c4a0
- https://www.geeksforgeeks.org/mongoose-queries/