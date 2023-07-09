const { nanoid } = require('nanoid');
const books = require('./books');

// method untuk menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  /**
   * memasukkan nilai-nilai yang diinput user serta yang dibikin oleh sistem
   * ke dalam array book menggunakan method push()
   */
  books.push(newBook);

  // method filter() untuk mengetahui apakah newBook sudah masuk ke array books atau belum
  const isSuccess = books.filter((b) => b.id === id).length > 0;
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  if (!name && !reading && !finished) {
    const booksAll = books.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    }));
    return h.response({
      status: 'success',
      data: {
        books: booksAll,
      },
    }).code(200);
  }

  // eslint-disable-next-line max-len
  const booksFiltered = books.filter(({ name: bookName, reading: bookReading, finished: bookFinished }) => {
    if (name && !bookName.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }

    if (reading !== undefined && (reading === '0' ? bookReading : !bookReading)) {
      return false;
    }

    if (finished !== undefined && (finished === '0' ? bookFinished : !bookFinished)) {
      return false;
    }

    return true;
  });
  const mappedBooks = booksFiltered.map(
    (book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }),
  );
  return h.response({
    status: 'success',
    data: {
      books: mappedBooks,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookResult = books.find((b) => b.id === bookId);
  if (bookResult) {
    return h.response({
      status: 'success',
      data: {
        book: bookResult,
      },
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // VALIDATION CHECKS
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
