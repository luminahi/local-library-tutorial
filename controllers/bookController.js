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
exports.book_update_post = exports.book_update_get = exports.book_delete_post = exports.book_delete_get = exports.book_create_post = exports.book_create_get = exports.book_detail = exports.book_list = exports.index = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const author_1 = require("../models/author");
const book_1 = require("../models/book");
const bookinstance_1 = require("../models/bookinstance");
const genre_1 = require("../models/genre");
const index = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [numBooks, numBookInstances, numAvailableBookInstances, numAuthors, numGenres,] = yield Promise.all([
        book_1.Book.countDocuments({}).exec(),
        bookinstance_1.BookInstance.countDocuments({}).exec(),
        bookinstance_1.BookInstance.countDocuments({ status: "Available" }).exec(),
        author_1.Author.countDocuments({}).exec(),
        genre_1.Genre.countDocuments({}).exec(),
    ]);
    res.render("index", {
        title: "Local Library Home",
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: numAvailableBookInstances,
        author_count: numAuthors,
        genre_count: numGenres,
    });
}));
exports.index = index;
// Display list of all books.
const book_list = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allBooks = yield book_1.Book.find({}, "title author")
        .sort({ title: 1 })
        .populate("author")
        .exec();
    res.render("book_list", { title: "Book List", book_list: allBooks });
}));
exports.book_list = book_list;
// Display detail page for a specific book.
const book_detail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [book, bookInstances] = yield Promise.all([
        book_1.Book.findById(req.params.id)
            .populate("author")
            .populate("genre")
            .exec(),
        bookinstance_1.BookInstance.find({ book: req.params.id }).exec(),
    ]);
    if (book === null) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }
    res.render("book_detail", {
        title: book.title,
        book: book,
        book_instances: bookInstances,
    });
}));
exports.book_detail = book_detail;
// Display book create form on GET.
const book_create_get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [authors, genres] = yield Promise.all([
        author_1.Author.find().exec(),
        genre_1.Genre.find().exec(),
    ]);
    res.render("book_form", { title: "Create Book", authors, genres });
});
exports.book_create_get = book_create_get;
// Handle book create on POST.
const book_create_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined")
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },
    // Validate and sanitize fields
    (0, express_validator_1.body)("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("author", "Author must no be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)("genre.*").escape(),
    // After validation
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const book = new book_1.Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });
        console.log(req.body);
        if (!errors.isEmpty()) {
            // If there are errors, render the form again with the error messages
            // Preparing the form again for a new render
            const [authors, genres] = yield Promise.all([
                author_1.Author.find().exec(),
                genre_1.Genre.find().exec(),
            ]);
            // Mark our selected genres as checked.
            for (const genre of genres) {
                if (book.genre.indexOf(genre._id) > -1) {
                    genre.checked = "true";
                }
            }
            res.render("book_form", {
                title: "Create Book",
                authors,
                genres,
                book,
                errors: errors.array(),
            });
        }
        else {
            // If data is valid
            yield book.save();
            res.redirect(book.url);
        }
    })),
];
exports.book_create_post = book_create_post;
// Display book delete form on GET.
const book_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [book, allBooks] = yield Promise.all([
        book_1.Book.findById(req.params.id).exec(),
        bookinstance_1.BookInstance.find({ book: req.params.id }, "imprint").exec(),
    ]);
    if (!book) {
        res.redirect("/catalog/books");
    }
    res.render("book_delete", {
        title: "Delete Book",
        book,
        books: allBooks,
    });
}));
exports.book_delete_get = book_delete_get;
// Handle book delete on POST.
const book_delete_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [book, allBooks] = yield Promise.all([
        book_1.Book.findById(req.params.id).exec(),
        book_1.Book.find({ book: req.params.id }).exec(),
    ]);
    if (allBooks.length > 0) {
        res.render("book_delete", {
            title: "Delete Book",
            book,
            books: allBooks,
        });
    }
    else {
        yield book_1.Book.findByIdAndDelete(req.body.bookid).exec();
        res.redirect("/catalog/books");
    }
}));
exports.book_delete_post = book_delete_post;
// Display book update form on GET.
const book_update_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get book, authors and genres for form.
    const [book, allAuthors, allGenres] = yield Promise.all([
        book_1.Book.findById(req.params.id)
            .populate("author")
            .populate("genre")
            .exec(),
        author_1.Author.find().exec(),
        genre_1.Genre.find().exec(),
    ]);
    if (book === null) {
        // No results.
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }
    // Mark our selected genres as checked.
    for (const genre of allGenres) {
        for (const book_g of book.genre) {
            if (genre._id.toString() === book_g._id.toString()) {
                genre.checked = "true";
            }
        }
    }
    res.render("book_form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
    });
}));
exports.book_update_get = book_update_get;
// Handle book update on POST.
const book_update_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") {
                req.body.genre = [];
            }
            else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    // Validate and sanitize fields.
    (0, express_validator_1.body)("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)("genre.*").escape(),
    // Process request after validation and sanitization.
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = (0, express_validator_1.validationResult)(req);
        // Create a Book object with escaped/trimmed data and old id.
        const book = new book_1.Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            // Get all authors and genres for form
            const [allAuthors, allGenres] = yield Promise.all([
                author_1.Author.find().exec(),
                genre_1.Genre.find().exec(),
            ]);
            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (book.genre.indexOf(allGenres._id) > -1) {
                    genre.checked = "true";
                }
            }
            res.render("book_form", {
                title: "Update Book",
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            const thebook = yield book_1.Book.findByIdAndUpdate(req.params.id, book, {});
            // Redirect to book detail page.
            res.redirect(thebook === null || thebook === void 0 ? void 0 : thebook.url);
        }
    })),
];
exports.book_update_post = book_update_post;
