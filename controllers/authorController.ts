import { Request, Response, NextFunction } from "express";
import { default as asyncHandler } from "express-async-handler";
import { body, validationResult } from "express-validator";

import { Author } from "../models/author";
import { Book } from "../models/book";

// Display list of all authors
const author_list = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
        res.render("author_list", {
            title: "Author List",
            author_list: allAuthors,
        });
    }
);

// Display detail page for a specific Author
const author_detail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [author, allBooksByAuthor] = await Promise.all([
            Author.findById(req.params.id).exec(),
            Book.find({ author: req.params.id }, "title summary").exec(),
        ]);

        if (!author) {
            const err: any = new Error("Author not found");
            err.status = 404;
            return next(err);
        }

        res.render("author_detail", { author, author_books: allBooksByAuthor });
    }
);

// Display Author create form on GET
const author_create_get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST
const author_create_post = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified"),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified"),
    body("date_of_birth", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    // After validation
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        const author = new Author({
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
        } else {
            // If data is valid
            await author.save();
            res.redirect(author.url);
        }
    }),
];

// Display Author delete form on GET
const author_delete_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [author, allBooksByAuthor] = await Promise.all([
            Author.findById(req.params.id).exec(),
            Book.find({ author: req.params.id }, "title summary").exec(),
        ]);

        if (author === null) {
            res.redirect("/catalog/authors");
        }

        res.render("author_delete", {
            title: "Delete Author",
            author,
            author_books: allBooksByAuthor,
        });
    }
);

// Handle Author delete on POST
const author_delete_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get details of author and all their books (in parallel)
        const [author, allBooksByAuthor] = await Promise.all([
            Author.findById(req.params.id).exec(),
            Book.find({ author: req.params.id }, "title summary").exec(),
        ]);

        if (allBooksByAuthor.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render("author_delete", {
                title: "Delete Author",
                author: author,
                author_books: allBooksByAuthor,
            });
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            await Author.findByIdAndRemove(req.body.authorid);
            res.redirect("/catalog/authors");
        }
    }
);

// Display Author update form on GET
const author_update_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Author update GET");
    }
);

// Handle Author update on POST
const author_update_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Author update POST");
    }
);

export {
    author_list,
    author_detail,
    author_create_get,
    author_create_post,
    author_delete_get,
    author_delete_post,
    author_update_get,
    author_update_post,
};
