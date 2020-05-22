import express from "express";
import routes from "../routes";
import {
  postResiterView,
  postAddComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postResiterView);
apiRouter.post(routes.addComment, postAddComment);

export default apiRouter;
