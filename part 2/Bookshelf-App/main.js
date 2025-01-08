let books = [];

const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

function loadFromLocalStorage() {
  const booksData = localStorage.getItem('books');
  return booksData ? JSON.parse(booksData) : [];
}

function saveToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks(filteredBooks = books) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach(book => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }

    bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => moveBook(book.id));

    bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => deleteBook(book.id));

    bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => editBook(book.id));
  });
}

function searchBooks(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
  renderBooks(filteredBooks);
}

function addBook(event) {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year: Number(year),
    isComplete
  };

  books.push(newBook);
  saveToLocalStorage();
  renderBooks();
}

function moveBook(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete; 
    saveToLocalStorage();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId); 
  saveToLocalStorage();
  renderBooks();
}

function editBook(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    document.getElementById('bookFormSubmit').textContent = "Perbarui Buku";
    document.getElementById('bookForm').onsubmit = function(e) {
      e.preventDefault();

      book.title = document.getElementById('bookFormTitle').value;
      book.author = document.getElementById('bookFormAuthor').value;
      book.year = Number(document.getElementById('bookFormYear').value);
      book.isComplete = document.getElementById('bookFormIsComplete').checked;

      books = books.filter(b => b.id !== bookId); 

      saveToLocalStorage();

      renderBooks();

      document.getElementById('bookFormSubmit').textContent = "Masukkan Buku ke rak";
      document.getElementById('bookForm').onsubmit = addBook;
    };
  }
}

document.getElementById('bookForm').addEventListener('submit', addBook);
document.getElementById('searchBook').addEventListener('submit', searchBooks);

window.onload = function() {
  books = loadFromLocalStorage();
  renderBooks();
};
