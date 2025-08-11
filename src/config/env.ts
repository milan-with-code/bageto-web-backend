import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://bagetoBackend:bageto5291@cluster0.klmzqtr.mongodb.net/"
};
