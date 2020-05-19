mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  
    ISBN: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Author: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    SellerEmail: {
      type: String,
      required: true,
    },
    Used: {
      type: Boolean,
      required: true,
    },
    Location: {
        City: {
          type: String,
          required: true,
        },
        Street: {
          type: String,
          required: true,
        }
    }

});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;