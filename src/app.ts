import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Backend is running 🚀" });
});

app.use("/api/users", userRoutes);

export default app;
