import express from "express";
import { searchAnimeController } from "./anime.controller.js";


const router = express.Router();

router.get("/search", searchAnimeController);

export default router;