import { Router } from "express";
import { login, register, logout } from "../controllers/AuthController.js";

const route = Router();

route.post("/register", register);

/** @swagger
* /auth/login:
*   post:
*     summary: User login
*     description: Authenticate user with email and password
*     tags:
*       - Authentication
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 example: "user@example.com"
*               password:
*                 type: string
*                 example: "password123"
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*       401:
*         description: Unauthorized
*/
route.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout the user by clearing the token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 */
route.post("/logout", logout);

// Route test
route.get("/test", (req, res) => {
  res.send("Auth route is working!");
});

export default route;