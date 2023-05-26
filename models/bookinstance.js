"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookInstance = void 0;
const mongoose_1 = require("mongoose");
const { DateTime } = require("luxon");
const BookInstanceSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
});
// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
    return `/catalog/bookinstance/${this._id}`;
});
// Virtual for formatted date
BookInstanceSchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});
const BookInstance = (0, mongoose_1.model)("BookInstance", BookInstanceSchema);
exports.BookInstance = BookInstance;
