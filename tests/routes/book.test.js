const sinon = require('sinon');
const mongoose = require('mongoose')
mongoose.set('debug', true)
require('sinon-mongoose')

const app = require('../../index.js')
const agent = require('supertest').agent(app);
const expect = require('chai').expect;

const Book = mongoose.model('Book')
var mock = sinon.mock(Book)

beforeEach(() => {
	mock.restore(); 
	mock = sinon.mock(Book)
});

afterEach( () => {
	mock.verify();
});

	const expected = {
		"_id": "5ec396cd1fe6cf05397ea8fa",
    "ISBN": "978-0-321-87758-1",
    "Title": "Essential C#5.0",
    "Author": "Mark Michaelis",
    "Price": 59.99,
    "SellerEmail": "someone@someplace.com",
    "Used": true,
    "Location": {
        "City": "Redmond",
        "Street": "156TH AVE NE"
		},
		"__V": 0,
	}
	const request = { 
		"ISBN": "978-0-321-87758-1",
    "Title": "Essential C#5.0",
    "Author": "Mark Michaelis",
    "Price": 59.99,
    "SellerEmail": "someone@someplace.com",
    "Used": true,
    "Location": {
        "City": "Redmond",
        "Street": "156TH AVE NE"
    }
	}

describe('books.get', ()  => {

	it('Should return an array of all books', (done) => {
		mock
		.expects('find')
		.chain('exec')
		.resolves([expected]);

		agent
		.get('/books')
		.end((err,res) => {
			expect(res.status).to.equal(200);
			expect(res.body).to.eql([expected]);
			done();
		});
	});

	it('Should return a single book with the given ID', (done) => {

		mock
		.expects('findById')
		.withArgs('5ec396cd1fe6cf05397ea8fa')
		.chain('exec')
		.resolves(expected)

		agent
		.get('/books/5ec396cd1fe6cf05397ea8fa')
		.end((err,res) => {
			expect(res.status).to.equal(200);
			expect(res.body).to.eql(expected);
			done();
		});
	});

	it('Should return 404 if no book was found with the given ID', (done) => {
		mock
		.expects('findById')
		.withArgs('5ec396cd1fe6cf0539712345')
		.chain('exec')
		.resolves(null)

		agent
		.get('/books/5ec396cd1fe6cf0539712345')
		.end((err,res) => {
			expect(res.status).to.equal(404);
			done();
		});
	})

	it('Should return all books with the given author', (done) => {
		mock
		.expects('find')
		.withArgs({'Author':'Mark Michaelis'})
		.chain('exec')
		.resolves([expected])

		agent
		.get('/books?Author=Mark+Michaelis')
		.end((err,res) => {
			expect(res.status).to.equal(200);
			expect(res.body).to.eql([expected]);
			done();
		})
	})
	it('Should return all books with the given title', (done) => {
		mock
		.expects('find')
		.withArgs({'Title':'Essential C#5.0'})
		.chain('exec')
		.resolves([expected])

		agent
		.get('/books?Title=Essential+C%235.0')
		.end((err,res) => {
			expect(res.status).to.equal(200);
			expect(res.body).to.eql([expected]);
			done();
		})
	})

});

describe('books.post', () => {


it('Should create a new book', (done) => {

	mock
	.expects('create')
	.withArgs(request)
	.chain('exec')
	.resolves(expected)

	agent
	.post('/books')
	.send(request)
	.end((err,res) => {
		expect(res.status).to.equal(201);
		expect(res.body).to.eql(expected);
		done();
	})
})
});

describe('books.put', () => {


	it('Should update an existing book', (done) => {
		mock
		.expects('updateOne')
		.withArgs({_id:'5ec396cd1fe6cf05397ea8fa'}, request)
		.chain('exec')
		.resolves({
			n:1,
			nModified:1,
			ok: 1
		})

		agent
		.put('/books/5ec396cd1fe6cf05397ea8fa')
		.send(request)
		.end((err,res) => {
			expect(res.status).to.equal(200);
			done();
		})
	})

	it('Should return 201 if a new book was created at the specified ID', (done) => {
		mock
		.expects('updateOne')
		.withArgs({_id:'5ec396cd1fe6cf05397ea8fa'}, request)
		.chain('exec')
		.resolves({
			n: 1,
			nModified: 0,
			upserted: [ { index: 0, _id: '5ec3854b47c7e90235aa9e17' } ],
			ok: 1
		})

		agent
		.put('/books/5ec396cd1fe6cf05397ea8fa')
		.send(request)
		.end((err,res) => {
			expect(res.status).to.equal(201);
			done();
		})
	})

	it('Should return 204 if nothing was updated', (done) => {
		mock
		.expects('updateOne')
		.withArgs({_id:'5ec396cd1fe6cf05397ea8fa'}, request)
		.chain('exec')
		.resolves({
			n:1,
			nModified:0,
			ok: 1
		})

		agent
		.put('/books/5ec396cd1fe6cf05397ea8fa')
		.send(request)
		.end((err,res) => {
			expect(res.status).to.equal(204);
			done();
		})
	})
});


describe('books.delete', () => {

	it('Should remove a book', (done) => {
		mock
		.expects('findByIdAndDelete')
		.withArgs('5ec396cd1fe6cf05397ea8fa')
		.chain('exec')
		.resolves('200')

		agent
		.delete('/books/5ec396cd1fe6cf05397ea8fa')
		.end((err,res) => {
			expect(res.status).to.equal(200)
			done();
		})
	})
	it('Should return 204 if nothing was deleted', (done) => {
		mock
		.expects('findByIdAndDelete')
		.withArgs('5ec396cd1fe6cf05397ea8fa')
		.chain('exec')
		.resolves(null)

		agent
		.delete('/books/5ec396cd1fe6cf05397ea8fa')
		.end((err,res) => {
			expect(res.status).to.equal(204)
			done();
		})
	})
})