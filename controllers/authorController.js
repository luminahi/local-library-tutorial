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
exports.author_update_post = exports.author_update_get = exports.author_delete_post = exports.author_delete_get = exports.author_create_post = exports.author_create_get = exports.author_detail = exports.author_list = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const author_1 = require("../models/author");
const book_1 = require("../models/book");
// Display list of all authors
const author_list = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAuthors = yield author_1.Author.find().sort({ family_name: 1 }).exec();
    res.render("author_list", {
        title: "Author List",
        author_list: allAuthors,
    });
}));
exports.author_list = author_list;
// Display detail page for a specific Author
const author_detail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [author, allBooksByAuthor] = yield Promise.all([
        author_1.Author.findById(req.params.id).exec(),
        book_1.Book.find({ author: req.params.id }, "title summary").exec(),
    ]);
    if (!author) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }
    res.render("author_detail", { author, author_books: allBooksByAuthor });
}));
exports.author_detail = author_detail;
// Display Author create form on GET
const author_create_get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("author_form", { title: "Create Author" });
});
exports.author_create_get = author_create_get;
// Handle Author create on POST
const author_create_post = [
    (0, express_validator_1.body)("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified"),
    (0, express_validator_1.body)("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified"),
    (0, express_validator_1.body)("date_of_birth", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    (0, express_validator_1.body)("date_of_death", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    // After validation
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const author = new author_1.Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });
        if (!errors.isEmpty()) {
            // If there are errors, render the form again with the error messages
            res.render("author_form", {
                title: "Create Author",
                author,
                errors: errors.array(),
            });
            return;
        }
        else {
            // If data is valid
            yield author.save();
            res.redirect(author.url);
        }
    })),
];
exports.author_create_post = author_create_post;
// Display Author delete form on GET
const author_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [author, allBooksByAuthor] = yield Promise.all([
        author_1.Author.findById(req.params.id).exec(),
        book_1.Book.find({ author: req.params.id }, "title summary").exec(),
    ]);
    if (author === null) {
        res.redirect("/catalog/authors");
    }
    res.render("author_delete", {
        title: "Delete Author",
        author,
        author_books: allBooksByAuthor,
    });
}));
exports.author_delete_get = author_delete_get;
// Handle Author delete on POST
const author_delete_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = yield Promise.all([
        author_1.Author.findById(req.params.id).exec(),
        book_1.Book.find({ author: req.params.id }, "title summary").exec(),
    ]);
    if (allBooksByAuthor.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("author_delete", {
            title: "Delete Author",
            author: author,
            author_books: allBooksByAuthor,
        });
    }
    else {
        // Author has no books. Delete object and redirect to the list of authors.
        yield author_1.Author.findByIdAndRemove(req.body.authorid);
        res.redirect("/catalog/authors");
    }
}));
exports.author_delete_post = author_delete_post;
// Display Author update form on GET
const author_update_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: Author update GET");
}));
exports.author_update_get = author_update_get;
// Handle Author update on POST
const author_update_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: Author update POST");
}));
exports.author_update_post = author_update_post;
