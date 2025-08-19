const API_BASE_URL = 'http://localhost:8080/api/books';

// Load books when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadStatistics();
});

// Fetch all books
async function loadBooks() {
    try {
        const response = await fetch(API_BASE_URL);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Search books
async function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`${API_BASE_URL}/search?title=${encodeURIComponent(searchTerm)}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error searching books:', error);
    }
}

// Display books in the UI
function displayBooks(books) {
    const booksContainer = document.getElementById('books');
    booksContainer.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.publicationYear}</p>
            <p><strong>Genre:</strong> ${book.genre || 'N/A'}</p>
            <p><strong>Rating:</strong> ${book.rating ? '⭐'.repeat(Math.round(book.rating)) : 'Not rated'}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            ${book.description ? `<p>${book.description}</p>` : ''}
            <button onclick="deleteBook(${book.id})">Delete</button>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats/catalog`);
        const stats = await response.json();
        
        const statsContainer = document.getElementById('stats');
        statsContainer.innerHTML = `
            <p><strong>Total Books:</strong> ${stats.totalBooks}</p>
            <p><strong>Average Rating:</strong> ${stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</p>
            <p><strong>Publication Range:</strong> ${stats.oldestPublicationYear} - ${stats.newestPublicationYear}</p>
        `;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Add new book
document.getElementById('bookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newBook = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        publicationYear: parseInt(document.getElementById('publicationYear').value),
        isbn: document.getElementById('isbn').value,
        genre: document.getElementById('genre').value || null,
        rating: document.getElementById('rating').value ? parseFloat(document.getElementById('rating').value) : null,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            document.getElementById('bookForm').reset();
            loadBooks();
            loadStatistics();
            alert('Book added successfully!');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

// Delete book
async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadBooks();
                loadStatistics();
                alert('Book deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }
}
