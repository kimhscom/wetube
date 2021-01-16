import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import path from "path";
import moment from "moment";
// import https from "https";
import routes from "./routes";

export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "wetube-another/video",
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(
        null,
        Math.random().toString(36).substring(2, 12) +
          Date.now().toString() +
          extension
      );
    },
  }),
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "wetube-another/avatar",
  }),
});

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.moment = moment;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

// Prevent sleep in Heroku server
/*
setInterval(() => {
  https.get("https://still-beyond-74200.herokuapp.com");
}, 600000); // every 10 minutes
*/
