import express from "express";
import routes from "../routes";
import { postResiterView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.get(routes.registerView, postResiterView);

export default apiRouter;
