import { Router } from "express";
import { authTokenMiddleware } from "../middleware/auth.middleware";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorite.controller";

const router = Router();

router.get("/", authTokenMiddleware, getFavorites);
router.post("/add", authTokenMiddleware, addToFavorites);
router.post("/remove", authTokenMiddleware, removeFromFavorites);

export default router;
