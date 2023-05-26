import { Schema, model } from "mongoose";

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    summary: { type: String, required: true },
    isbn: { type: String, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for book's URL
BookSchema.virtual("url").get(function () {
    return `/catalog/book/${this._id}`;
});

const Book = model("Book", BookSchema);

export { Book };
