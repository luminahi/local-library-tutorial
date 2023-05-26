import { Schema, model } from "mongoose";
const { DateTime } = require("luxon");

const AuthorSchema: Schema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    if (!this.first_name || !this.family_name) {
        fullname = "";
    }

    return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`;
});

// Virtual for born date
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    if (this.date_of_birth) {
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
            DateTime.DATE_MED
        );
    }

    return "unknown";
});

// Virtual for death date
AuthorSchema.virtual("date_of_death_formatted").get(function () {
    if (this.date_of_death) {
        return DateTime.fromJSDate(this.date_of_death).toLocaleString(
            DateTime.DATE_MED
        );
    }

    return "";
});

const Author = model("Author", AuthorSchema);

export { Author };
