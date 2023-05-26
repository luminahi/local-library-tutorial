import { Request, Response, NextFunction } from "express";
import { default as asyncHandler } from "express-async-handler";
import { body, validationResult } from "express-validator";

import { Book } from "../models/book";
import { BookInstance } from "../models/bookinstance";

// Display list of all BookInstances
const bookinstance_list = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const allBookInstances = await BookInstance.find({})
            .populate("book")
            .exec();

        res.render("bookinstance_list", {
            title: "Book Instance List",
            bookinstance_list: allBookInstances,
        });
    }
);

// Display detail page for a specific BookInstance
const bookinstance_detail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookInstance = await BookInstance.findById(req.params.id)
            .populate("book")
            .exec();

        if (!bookInstance) {
            const err: any = new Error("Book copy not found");
            err.status = 404;
            return next(err);
        }

        res.render("bookinstance_detail", {
            title: "Book:",
            bookinstance: bookInstance,
        });
    }
);

// Display BookInstance create form on GET
const bookinstance_create_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const books = await Book.find({}, "title").exec();
        res.render("bookinstance_form", {
            title: "Create Bookinstance",
            book_list: books,
        });
    }
);

// Handle BookInstance create on POST
const bookinstance_create_post = [
    body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        const bookInstance: any = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allBooks = await Book.find({}, "title").exec();

            res.render("bookinstance_form", {
                title: "Create BookInstance",
                book_list: allBooks,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: bookInstance,
            });
            return;
        } else {
            // Data from form is valid
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    }),
];

// Display BookInstance delete form on GET
const bookinstance_delete_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookinstance = await BookInstance.findById(req.params.id).exec();
        res.render("bookinstance_delete", {
            title: "Delete Book Instance",
            bookinstance,
        });
    }
);

// Handle BookInstance delete on POST
const bookinstance_delete_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        await BookInstance.findByIdAndDelete(req.body.bookinstanceid).exec();
        res.redirect("/catalog/bookinstances");
    }
);

// Display BookInstance update form on GET
const bookinstance_update_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: BookInstance update GET");
    }
);

// Handle bookinstance update on POST
const bookinstance_update_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: BookInstance update POST");
    }
);

export {
    bookinstance_list,
    bookinstance_detail,
    bookinstance_create_get,
    bookinstance_create_post,
    bookinstance_delete_get,
    bookinstance_delete_post,
    bookinstance_update_get,
    bookinstance_update_post,
};
