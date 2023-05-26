"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.catalogRouter = router;
// Controller modules
const book_controller = __importStar(require("../controllers/bookController"));
const author_controller = __importStar(require("../controllers/authorController"));
const genre_controller = __importStar(require("../controllers/genreController"));
const book_instance_controller = __importStar(require("../controllers/bookInstanceController"));
// Book Routes
// GET catalog home page
router.get("/", book_controller.index);
// GET request for creating a Book. NOTE This must come before routes that display Book (uses id)
router.get("/book/create", book_controller.book_create_get);
// POST request for creating Book
router.post("/book/create", book_controller.book_create_post);
// GET request to delete Book
router.get("/book/:id/delete", book_controller.book_delete_get);
// POST request to delete Book
router.post("/book/:id/delete", book_controller.book_delete_post);
// GET request to update Book
router.get("/book/:id/update", book_controller.book_update_get);
// POST request to update Book
router.post("/book/:id/update", book_controller.book_update_post);
// GET request for one Book
router.get("/book/:id", book_controller.book_detail);
// GET request for list of all Book items
router.get("/books", book_controller.book_list);
// Author Routes
// GET request for creating Author. NOTE This must come before route for id (i.e. display author)
router.get("/author/create", author_controller.author_create_get);
// POST request for creating Author
router.post("/author/create", author_controller.author_create_post);
// GET request to delete Author
router.get("/author/:id/delete", author_controller.author_delete_get);
// POST request to delete Author
router.post("/author/:id/delete", author_controller.author_delete_post);
// GET request to update Author
router.get("/author/:id/update", author_controller.author_update_get);
// POST request to update Author
router.post("/author/:id/update", author_controller.author_update_post);
// GET request for one Author
router.get("/author/:id", author_controller.author_detail);
// GET request for list of all Authors
router.get("/authors", author_controller.author_list);
// Genre Routes
// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id)
router.get("/genre/create", genre_controller.genre_create_get);
//POST request for creating Genre
router.post("/genre/create", genre_controller.genre_create_post);
// GET request to delete Genre
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
// POST request to delete Genre
router.post("/genre/:id/delete", genre_controller.genre_delete_post);
// GET request to update Genre
router.get("/genre/:id/update", genre_controller.genre_update_get);
// POST request to update Genre
router.post("/genre/:id/update", genre_controller.genre_update_post);
// GET request for one Genre
router.get("/genre/:id", genre_controller.genre_detail);
// GET request for list of all Genre
router.get("/genres", genre_controller.genre_list);
// Bookinstance Routes
// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id)
router.get("/bookinstance/create", book_instance_controller.bookinstance_create_get);
// POST request for creating BookInstance
router.post("/bookinstance/create", book_instance_controller.bookinstance_create_post);
// GET request to delete BookInstance
router.get("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_get);
// POST request to delete BookInstance
router.post("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_post);
// GET request to update BookInstance
router.get("/bookinstance/:id/update", book_instance_controller.bookinstance_update_get);
// POST request to update BookInstance
router.post("/bookinstance/:id/update", book_instance_controller.bookinstance_update_post);
// GET request for one BookInstance
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);
// GET request for list of all BookInstance
router.get("/bookinstances", book_instance_controller.bookinstance_list);
