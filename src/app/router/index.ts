import { IRouter, Router } from "express";
import userRouter from "../modules/user/userRouter";
import blogRouter from "../modules/blog/blogRouter";
import authRouter from "../modules/auth/authRouter";
import OTPRouter from "../modules/OTP/otpRouter";

interface ModuleRoute {
  path: string;
  router: IRouter;
}

const router: IRouter = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/blog",
    router: blogRouter,
  },
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/OTP",
    router: OTPRouter,
  },
];

// router.use("/user", userRouter);
// router.use("/blog", blogRouter);
moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;

// --------------------------------------------------------------------

// import express, { IRouter } from "express";

// const router: IRouter = express.Router();

// router.get("/users", (req, res) => {
//   res.send("All users");
// });

// router.post("/users", (req, res) => {
//   res.send("User created");
// });

// ------------------------------------------------------------------

// import express, { IRoute } from "express";

// const router = express.Router();

// const userRoute: IRoute = router.route("/user");

// userRoute.get((req, res) => {
//   res.send("Get user");
// });

// userRoute.post((req, res) => {
//   res.send("Create user");
// });
