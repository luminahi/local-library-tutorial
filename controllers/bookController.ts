import { Request, Response, NextFunction } from "express";
import { default as asyncHandler } from "express-async-handler";
import { body, validationResult } from "express-validator";

import { Author } from "../models/author";
import { Book } from "../models/book";
import { BookInstance } from "../models/bookinstance";
import { Genre } from "../models/genre";

const index = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [
            numBooks,
            numBookInstances,
            numAvailableBookInstances,
            numAuthors,
            numGenres,
        ] = await Promise.all([
            Book.countDocuments({}).exec(),
            BookInstance.countDocuments({}).exec(),
            BookInstance.countDocuments({ status: "Available" }).exec(),
            Author.countDocuments({}).exec(),
            Genre.countDocuments({}).exec(),
        ]);

        res.render("index", {
            title: "Local Library Home",
            book_count: numBooks,
            book_instance_count: numBookInstances,
            book_instance_available_count: numAvailableBookInstances,
            author_count: numAuthors,
            genre_count: numGenres,
        });
    }
);

// Display list of all books.
const book_list = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const allBooks = await Book.find({}, "title author")
            .sort({ title: 1 })
            .populate("author")
            .exec();
        res.render("book_list", { title: "Book List", book_list: allBooks });
    }
);

// Display detail page for a specific book.
const book_detail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [book, bookInstances] = await Promise.all([
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(),
            BookInstance.find({ book: req.params.id }).exec(),
        ]);

        if (book === null) {
            const err: any = new Error("Book not found");
            err.status = 404;
            return next(err);
        }

        res.render("book_detail", {
            title: book.title,
            book: book,
            book_instances: bookInstances,
        });
    }
);

// Display book create form on GET.
const book_create_get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const [authors, genres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
    ]);
    res.render("book_form", { title: "Create Book", authors, genres });
};

// Handle book create on POST.
const book_create_post = [
    (req: Request, res: Response, next: NextFunction) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") req.body.genre = [];
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Author must no be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    // After validation
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        const book = new Book({
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
            const [authors, genres] = await Promise.all([
                Author.find().exec(),
                Genre.find().exec(),
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
        } else {
            // If data is valid
            await book.save();
            res.redirect(book.url);
        }
    }),
];

// Display book delete form on GET.
const book_delete_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [book, allBooks] = await Promise.all([
            Book.findById(req.params.id).exec(),
            BookInstance.find({ book: req.params.id }, "imprint").exec(),
        ]);

        if (!book) {
            res.redirect("/catalog/books");
        }

        res.render("book_delete", {
            title: "Delete Book",
            book,
            books: allBooks,
        });
    }
);

// Handle book delete on POST.
const book_delete_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [book, allBooks] = await Promise.all([
            Book.findById(req.params.id).exec(),
            Book.find({ book: req.params.id }).exec(),
        ]);

        if (allBooks.length > 0) {
            res.render("book_delete", {
                title: "Delete Book",
                book,
                books: allBooks,
            });
        } else {
            await Book.findByIdAndDelete(req.body.bookid).exec();
            res.redirect("/catalog/books");
        }
    }
);

// Display book update form on GET.
const book_update_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get book, authors and genres for form.
        const [book, allAuthors, allGenres] = await Promise.all([
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(),
            Author.find().exec(),
            Genre.find().exec(),
        ]);

        if (book === null) {
            // No results.
            const err = new Error("Book not found");
            (err as any).status = 404;
            return next(err);
        }

        // Mark our selected genres as checked.
        for (const genre of allGenres) {
            for (const book_g of book.genre) {
                if ((genre as any)._id.toString() === book_g._id.toString()) {
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
    }
);

// Handle book update on POST.
const book_update_post = [
    // Convert the genre to an array.
    (req: Request, res: Response, next: NextFunction) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        const book = new Book({
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
            const [allAuthors, allGenres] = await Promise.all([
                Author.find().exec(),
                Genre.find().exec(),
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (book.genre.indexOf((allGenres as any)._id) > -1) {
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
        } else {
            // Data from form is valid. Update the record.
            const thebook = await Book.findByIdAndUpdate(
                req.params.id,
                book,
                {}
            );
            // Redirect to book detail page.
            res.redirect(thebook?.url);
        }
    }),
];

export {
    index,
    book_list,
    book_detail,
    book_create_get,
    book_create_post,
    book_delete_get,
    book_delete_post,
    book_update_get,
    book_update_post,
};
