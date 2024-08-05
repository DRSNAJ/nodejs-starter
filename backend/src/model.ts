import mongoose from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends mongoose.Document {
    username: String,
    password: String,
    printDetails: () => String,
    hashPassword: () => void,
    verifyPassword: (inputPassword: String) => Promise<boolean>,
}

const UserSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.methods.printDetails = function printDetails() {
    return `username: ${this.username}\npassword: ${this.password}`;
};

UserSchema.methods.hashPassword = async function hashPassword() {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;

};

UserSchema.methods.verifyPassword = async function verifyPassword(inputPassword: String) {
    const isValid = await bcrypt.compare(inputPassword.toString(), this.password);
    if (isValid) {
        console.log("Password Accepted")
    } else {
        console.log("Invalid Password")
    }
    return isValid;
};

const UserModel = mongoose.model('user_cred',UserSchema);

export default UserModel;