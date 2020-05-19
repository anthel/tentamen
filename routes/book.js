getBooks = (req, res, next) => {
  req.models.Book.find(req.query).then((books) => {
      return res.send(books);
    }).catch((error) => {
      next(error);
    })
}
getSingleBook = (req, res, next) => {
  req.models.Book.findById(req.params.id)
    .then((result) => {
      if(result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      next(error);
    })
}
createBook = (req, res, next) => {
  req.models.Book.create({
    
      ISBN: req.body.ISBN,
      Title: req.body.Title,
      Author: req.body.Author,
      Price: req.body.Price,
      SellerEmail: req.body.SellerEmail,
      Used: req.body.Used,
      Location: {
          City: req.body.Location.City,
          Street: req.body.Location.Street
      }  
  }).then((response) => {
    return res.status(201).send(response);
  }).catch((error) => {
    next(error);
  })
}

updateBook = (req, res, next) => {
  req.models.Book.updateOne({_id:req.params.id}, 
  {
    ISBN: req.body.ISBN,
      Title: req.body.Title,
      Author: req.body.Author,
      Price: req.body.Price,
      SellerEmail: req.body.SellerEmail,
      Used: req.body.Used,
      Location: {
          City: req.body.Location.City,
          Street: req.body.Location.Street
      }  
  },
  {
    upsert: true,
    new: true,
  }).then((status) => {
    if(status.nModified) {
      return res.sendStatus(200);
    }
    if(status.upserted) {
      return res.sendStatus(201);
    }
    else {
      return res.sendStatus(204);
    }
  }).catch((error) => {
    next(error);
  })
}

removeBook = (req, res, next) => {
  req.models.Book.findByIdAndDelete(req.params.id)
    .then((response) => {
      if(response) {
        return res.sendStatus(200);
      }
      res.sendStatus(204);
    }).catch((error) => {
      next(error);
    })
}

module.exports = {
  getBooks,
  getSingleBook,
  createBook,
  updateBook,
  removeBook
}