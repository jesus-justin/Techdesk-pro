import { Router } from "express";
import { AuthSchemas } from "@techdesk-pro/validators";
import { AuthService } from "../services/AuthService.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const input = AuthSchemas.loginSchema.parse(req.body);
    const result = await AuthService.login(input.email, input.password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const input = AuthSchemas.registerSchema.parse(req.body);
    const user = await AuthService.register(input);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const input = AuthSchemas.refreshTokenSchema.parse(req.body);
    const result = await AuthService.refreshToken(input.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", verifyToken, async (req, res, next) => {
  try {
    await AuthService.logout(req.user!.userId);
    res.json({ success: true, data: { loggedOut: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
