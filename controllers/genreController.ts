import { Request, Response, NextFunction } from "express";
import { default as asyncHandler } from "express-async-handler";
import { body, validationResult } from "express-validator";

import { Book } from "../models/book";
import { Genre } from "../models/genre";

// Display list of all Genres
const genre_list = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const allGenres = await Genre.find().sort({ name: 1 }).exec();

        res.render("genre_list", {
            title: "Genre List",
            genre_list: allGenres,
        });
    }
);

// Display detail page for a specific Genre
const genre_detail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [genre, booksInGenre] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Book.find({ genre: req.params.id }, "title summary").exec(),
        ]);

        if (genre == null) {
            const err: any = new Error("Genre not found");
            err.status = 404;
            return next(err);
        }

        res.render("genre_detail", {
            title: "Genre Detail",
            genre,
            genre_books: booksInGenre,
        });
    }
);

// Display Genre create form on GET
const genre_create_get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST
const genre_create_post = [
    // Validate and sanitize fields
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        // Extracting errors
        const errors = validationResult(req);

        // Getting our validated genre
        const genre = new Genre({
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
        } else {
            // If data is valid, check if genre name already exists
            const genreExists = await Genre.findOne({
                name: req.body.name,
            }).exec();

            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                // with no errors, we save the data and redirect to the detail page
                res.redirect(genre.url);
            }
        }
    }),
];

// Display Genre delete form on GET
const genre_delete_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [genre, allBooks] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Book.find({ genre: req.params.id }, "title summary").exec(),
        ]);

        res.render("genre_delete", {
            title: "Delete Genre",
            genre,
            books: allBooks,
        });
    }
);

// Handle Genre delete on POST
const genre_delete_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const [genre, allBooksByGenre] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Book.find({ genre: req.params.id }, "title summary").exec(),
        ]);

        if (allBooksByGenre.length > 0) {
            res.render("genre_delete", {
                title: "Delete Genre",
                genre,
                books: allBooksByGenre,
            });
        } else {
            await Genre.findByIdAndRemove(req.body.genreid).exec();
            res.redirect("/catalog/genres");
        }
    }
);

// Display Genre update form on GET
const genre_update_get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Genre update GET");
    }
);

// Handle Genre update on POST
const genre_update_post = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Genre update POST");
    }
);

export {
    genre_list,
    genre_detail,
    genre_create_get,
    genre_create_post,
    genre_delete_get,
    genre_delete_post,
    genre_update_get,
    genre_update_post,
};
