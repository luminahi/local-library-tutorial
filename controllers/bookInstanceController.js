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
exports.bookinstance_update_post = exports.bookinstance_update_get = exports.bookinstance_delete_post = exports.bookinstance_delete_get = exports.bookinstance_create_post = exports.bookinstance_create_get = exports.bookinstance_detail = exports.bookinstance_list = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const book_1 = require("../models/book");
const bookinstance_1 = require("../models/bookinstance");
// Display list of all BookInstances
const bookinstance_list = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allBookInstances = yield bookinstance_1.BookInstance.find({})
        .populate("book")
        .exec();
    res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: allBookInstances,
    });
}));
exports.bookinstance_list = bookinstance_list;
// Display detail page for a specific BookInstance
const bookinstance_detail = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookInstance = yield bookinstance_1.BookInstance.findById(req.params.id)
        .populate("book")
        .exec();
    if (!bookInstance) {
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
    }
    res.render("bookinstance_detail", {
        title: "Book:",
        bookinstance: bookInstance,
    });
}));
exports.bookinstance_detail = bookinstance_detail;
// Display BookInstance create form on GET
const bookinstance_create_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield book_1.Book.find({}, "title").exec();
    res.render("bookinstance_form", {
        title: "Create Bookinstance",
        book_list: books,
    });
}));
exports.bookinstance_create_get = bookinstance_create_get;
// Handle BookInstance create on POST
const bookinstance_create_post = [
    (0, express_validator_1.body)("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    (0, express_validator_1.body)("imprint", "Imprint must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)("status").escape(),
    (0, express_validator_1.body)("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const bookInstance = new bookinstance_1.BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });
        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allBooks = yield book_1.Book.find({}, "title").exec();
            res.render("bookinstance_form", {
                title: "Create BookInstance",
                book_list: allBooks,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: bookInstance,
            });
            return;
        }
        else {
            // Data from form is valid
            yield bookInstance.save();
            res.redirect(bookInstance.url);
        }
    })),
];
exports.bookinstance_create_post = bookinstance_create_post;
// Display BookInstance delete form on GET
const bookinstance_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookinstance = yield bookinstance_1.BookInstance.findById(req.params.id).exec();
    res.render("bookinstance_delete", {
        title: "Delete Book Instance",
        bookinstance,
    });
}));
exports.bookinstance_delete_get = bookinstance_delete_get;
// Handle BookInstance delete on POST
const bookinstance_delete_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield bookinstance_1.BookInstance.findByIdAndDelete(req.body.bookinstanceid).exec();
    res.redirect("/catalog/bookinstances");
}));
exports.bookinstance_delete_post = bookinstance_delete_post;
// Display BookInstance update form on GET
const bookinstance_update_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
}));
exports.bookinstance_update_get = bookinstance_update_get;
// Handle bookinstance update on POST
const bookinstance_update_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
}));
exports.bookinstance_update_post = bookinstance_update_post;
