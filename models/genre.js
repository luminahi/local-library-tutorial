"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const mongoose_1 = require("mongoose");
const GenreSchema = new mongoose_1.Schema({
    name: { type: String, minLength: 3, maxLength: 100, required: true },
});
// Virtual for genre's url
GenreSchema.virtual("url").get(function () {
    return `/catalog/genre/${this._id}`;
});
const Genre = (0, mongoose_1.model)("Genre", GenreSchema);
exports.Genre = Genre;
