import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import userProduct from "./routes/product.routes";
import userCart from "./routes/cart.routes";
import userOrder from "./routes/order.routes";
import userPayment from "./routes/payment.routes";
import userCategory from "./routes/category.routes";
import userFavorite from "./routes/favorite.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://bageto.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/products", userProduct);
app.use("/api/cart", userCart);
app.use("/api/orders", userOrder);
app.use("/api/categories", userCategory);
app.use("/api/favorites", userFavorite);


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Backend is running 🚀" });
});

export default app;
