import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();

/**
 * GET user page
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("users page");
});

router.get("/cool", async (req: Request, res: Response, next: NextFunction) => {
    res.send("<p style='font-weight: bold'>You're so cool!</p>");
});

export { router as usersRouter };
