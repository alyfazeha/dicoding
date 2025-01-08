let books = []; // Menyimpan daftar buku

// Mengambil referensi DOM
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// Fungsi untuk memuat buku dari localStorage
function loadFromLocalStorage() {
  const booksData = localStorage.getItem('books');
  return booksData ? JSON.parse(booksData) : [];
}

// Fungsi untuk menyimpan buku ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Fungsi untuk merender buku
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

    // Event listener untuk tombol "Selesai dibaca"
    bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => moveBook(book.id));

    // Event listener untuk tombol hapus
    bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => deleteBook(book.id));

    // Event listener untuk tombol edit
    bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => editBook(book.id));
  });
}

// Fungsi untuk mencari buku berdasarkan judul
function searchBooks(event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchQuery));
  renderBooks(filteredBooks);
}

// Fungsi untuk menambah buku baru
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

// Fungsi untuk memindahkan buku ke rak selesai dibaca / belum selesai dibaca
function moveBook(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete; // Toggle status
    saveToLocalStorage();
    renderBooks();
  }
}

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId); // Hapus buku berdasarkan ID
  saveToLocalStorage();
  renderBooks();
}

// Fungsi untuk mengedit buku
function editBook(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    // Menampilkan form dengan data buku yang dipilih untuk diedit
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    // Mengubah teks tombol menjadi "Perbarui Buku"
    document.getElementById('bookFormSubmit').textContent = "Perbarui Buku";

    // Mengubah handler submit untuk pembaruan buku
    document.getElementById('bookForm').onsubmit = function(e) {
      e.preventDefault();

      // Mengupdate buku dengan data dari form
      book.title = document.getElementById('bookFormTitle').value;
      book.author = document.getElementById('bookFormAuthor').value;
      book.year = Number(document.getElementById('bookFormYear').value);
      book.isComplete = document.getElementById('bookFormIsComplete').checked;

      // Menghapus buku lama dari daftar
      books = books.filter(b => b.id !== bookId); // Menghapus buku yang lama

      // Menyimpan perubahan ke localStorage
      saveToLocalStorage();

      // Render ulang semua buku
      renderBooks();

      // Reset teks tombol kembali ke 'Masukkan Buku ke rak'
      document.getElementById('bookFormSubmit').textContent = "Masukkan Buku ke rak";
      
      // Reset handler submit kembali untuk penambahan buku baru
      document.getElementById('bookForm').onsubmit = addBook;
    };
  }
}

// Event listener untuk form tambah buku
document.getElementById('bookForm').addEventListener('submit', addBook);

// Event listener untuk form pencarian buku
document.getElementById('searchBook').addEventListener('submit', searchBooks);

// Memuat buku dari localStorage saat halaman dimuat
window.onload = function() {
  books = loadFromLocalStorage();
  renderBooks();
};
