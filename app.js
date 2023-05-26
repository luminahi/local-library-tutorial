"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
require("dotenv").config();
const compression = require("compression");
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
const catalog_1 = require("./routes/catalog");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function main() {
    const limiter = (0, express_rate_limit_1.default)({ windowMs: 1 * 60 * 1000, max: 20 });
    const logger = require("morgan");
    const cookieParser = require("cookie-parser");
    const mongouri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.7f2yr4y.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
    mongoose_1.default.connect(mongouri);
    const app = (0, express_1.default)();
    const PORT = process.env.APP_PORT || 3000;
    app.set("views", path_1.default.join(__dirname, "views"));
    app.set("view engine", "pug");
    app.use(helmet_1.default.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    }));
    app.use(limiter);
    app.use(logger("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(compression());
    app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    app.use("/", index_1.indexRouter);
    app.use("/users", users_1.usersRouter);
    app.use("/catalog", catalog_1.catalogRouter);
    app.listen(PORT, () => {
        console.log(`app running at port ${PORT}`);
    });
}
exports.main = main;
