import { searchAnime } from "./anime.service.js";

export const searchAnimeController = async (req, res, next) => {
  try {
    const query =
      req.query.q;
    if (!query) {
      return res.status(400)
        .json({
          success: false,
          message: "Search query required"
        });
    }
    const results =
      await searchAnime(query);
    res.json({
      success: true,
      data: results
    });
  }
  catch (error) {
    next(error);
  }
};