import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import userProduct from "./routes/product.routes";
import userCart from "./routes/cart.routes";
import userOrder from "./routes/order.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000" || "https://bageto.vercel.app",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Backend is running 🚀" });
});

app.use("/api/users", userRoutes);
app.use("/api/products", userProduct);
app.use("/api/cart", userCart);
app.use("/api/orders", userOrder);
export default app;
