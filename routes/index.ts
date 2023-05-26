import { Router, Request, Response, NextFunction } from "express";

const express = require("express");
const router: Router = express.Router();

/**
 * GET home page
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).redirect("/catalog");
});

export { router as indexRouter };
