import express from "express";
import { authenticateToken } from "../src/middleware/auth";
import userActions from "../src/modules/user/userAction";

const router = express.Router();

router.post("/register", userActions.register);
router.post("/login", userActions.login);

router.get("/users", authenticateToken, userActions.browse);
export default router;
