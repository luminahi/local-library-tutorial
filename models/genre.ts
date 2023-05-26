import { Schema, model } from "mongoose";

const GenreSchema: Schema = new Schema({
    name: { type: String, minLength: 3, maxLength: 100, required: true },
});

// Virtual for genre's url
GenreSchema.virtual("url").get(function () {
    return `/catalog/genre/${this._id}`;
});

const Genre = model("Genre", GenreSchema);

export { Genre };
