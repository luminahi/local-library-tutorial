"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "Author", required: true },
    summary: { type: String, required: true },
    isbn: { type: String, required: true },
    genre: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Genre" }],
});
// Virtual for book's URL
BookSchema.virtual("url").get(function () {
    return `/catalog/book/${this._id}`;
});
const Book = (0, mongoose_1.model)("Book", BookSchema);
exports.Book = Book;
