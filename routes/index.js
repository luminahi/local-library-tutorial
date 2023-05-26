"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express = require("express");
const router = express.Router();
exports.indexRouter = router;
/**
 * GET home page
 */
router.get("/", (req, res, next) => {
    res.status(200).redirect("/catalog");
});
