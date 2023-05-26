require("dotenv").config();
const compression = require("compression");

import { indexRouter } from "./routes/index";
import { usersRouter } from "./routes/users";
import { catalogRouter } from "./routes/catalog";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import helmet from "helmet";
import RateLimit from "express-rate-limit";

function main() {
    const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 20 });

    const logger = require("morgan");
    const cookieParser = require("cookie-parser");

    const mongouri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.7f2yr4y.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
    mongoose.connect(mongouri);

    const app = express();
    const PORT = process.env.APP_PORT || 3000;

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
            },
        })
    );

    app.use(limiter);
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(compression());
    app.use(express.static(path.join(__dirname, "public")));
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/catalog", catalogRouter);

    app.listen(PORT, () => {
        console.log(`app running at port ${PORT}`);
    });
}

export { main };
