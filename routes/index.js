const express = require('express')
const router = express.Router()

const book = require('./book.js')

router.get("/books", book.getBooks)
router.get("/books/:id", book.getSingleBook)
router.post("/books", book.createBook)
router.put("/books/:id", book.updateBook)
router.delete("/books/:id", book.removeBook)

module.exports = router