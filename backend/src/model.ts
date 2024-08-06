import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nanoid } from 'nanoid';

interface IUser extends mongoose.Document {
    user_id: String,
    username: String,
    password: String,
    printDetails: () => String,
    hashPassword: () => void,
    verifyPassword: (inputPassword: String) => Promise<boolean>,
}

const UserSchema = new mongoose.Schema<IUser>({
    user_id: {
        type: String,
        required: true,
        default: () => nanoid(7),
        unique: true,
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.methods.printDetails = function printDetails() {
    const details = `username: ${this.username}\npassword: ${this.password}`;
    console.log(details); // Add console log
    return details;
};

UserSchema.methods.hashPassword = async function hashPassword() {
    const saltRounds = 10;
    console.log("Hashing password..."); // Add console log
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    console.log("Password hashed successfully."); // Add console log
};

UserSchema.methods.verifyPassword = async function verifyPassword(inputPassword: String) {
    console.log("Verifying password..."); // Add console log
    const isValid = await bcrypt.compare(inputPassword.toString(), this.password);
    if (isValid) {
        console.log("Password Accepted"); // Add console log
    } else {
        console.log("Invalid Password"); // Add console log
    }
    return isValid;
};

const UserModel = mongoose.model('user_cred', UserSchema);

export default UserModel;
