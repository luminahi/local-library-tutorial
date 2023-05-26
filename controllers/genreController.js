"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genre_update_post = exports.genre_update_get = exports.genre_delete_post = exports.genre_delete_get = exports.genre_create_post = exports.genre_create_get = exports.genre_detail = exports.genre_list = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const book_1 = require("../models/book");
const genre_1 = require("../models/genre");
// Display list of all Genres
const genre_list = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allGenres = yield genre_1.Genre.find().sort({ name: 1 }).exec();
    res.render("genre_list", {
        title: "Genre List",
        genre_list: allGenres,
    });
}));
exports.genre_list = genre_list;
// Display detail page for a specific Genre
const genre_detail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [genre, booksInGenre] = yield Promise.all([
        genre_1.Genre.findById(req.params.id).exec(),
        book_1.Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (genre == null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }
    res.render("genre_detail", {
        title: "Genre Detail",
        genre,
        genre_books: booksInGenre,
    });
}));
exports.genre_detail = genre_detail;
// Display Genre create form on GET
const genre_create_get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("genre_form", { title: "Create Genre" });
});
exports.genre_create_get = genre_create_get;
// Handle Genre create on POST
const genre_create_post = [
    // Validate and sanitize fields
    (0, express_validator_1.body)("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extracting errors
        const errors = (0, express_validator_1.validationResult)(req);
        // Getting our validated genre
        const genre = new genre_1.Genre({
            name: req.body.name,
        });
        if (!errors.isEmpty()) {
            // If there are errors, render the form again with the error messages
            res.render("genre_form", {
                title: "Genre Form",
                genre,
                errors: errors.array(),
            });
            return;
        }
        else {
            // If data is valid, check if genre name already exists
            const genreExists = yield genre_1.Genre.findOne({
                name: req.body.name,
            }).exec();
            if (genreExists) {
                res.redirect(genreExists.url);
            }
            else {
                yield genre.save();
                // with no errors, we save the data and redirect to the detail page
                res.redirect(genre.url);
            }
        }
    })),
];
exports.genre_create_post = genre_create_post;
// Display Genre delete form on GET
const genre_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [genre, allBooks] = yield Promise.all([
        genre_1.Genre.findById(req.params.id).exec(),
        book_1.Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    res.render("genre_delete", {
        title: "Delete Genre",
        genre,
        books: allBooks,
    });
}));
exports.genre_delete_get = genre_delete_get;
// Handle Genre delete on POST
const genre_delete_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [genre, allBooksByGenre] = yield Promise.all([
        genre_1.Genre.findById(req.params.id).exec(),
        book_1.Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (allBooksByGenre.length > 0) {
        res.render("genre_delete", {
            title: "Delete Genre",
            genre,
            books: allBooksByGenre,
        });
    }
    else {
        yield genre_1.Genre.findByIdAndRemove(req.body.genreid).exec();
        res.redirect("/catalog/genres");
    }
}));
exports.genre_delete_post = genre_delete_post;
// Display Genre update form on GET
const genre_update_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: Genre update GET");
}));
exports.genre_update_get = genre_update_get;
// Handle Genre update on POST
const genre_update_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: Genre update POST");
}));
exports.genre_update_post = genre_update_post;
