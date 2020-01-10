class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.querySelector('#book-list');
    
        // Create tr element
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(msg, className) {
        // Create Message Box
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
        
        // Insert Message Box To Dom
        const container = document.querySelector('div.container');
        container.insertBefore(div, form);

        // Disappear Alert After 3 Seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.className == 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Local Storage Class
class Storage {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Storage.getBooks();

        const ui = new UI();
        books.forEach(book => {

            // Add Book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();

        books.forEach((book, index) => {
            if(book.isbn == isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// DOM Event Load
document.addEventListener('DOMContentLoaded', Storage.displayBooks);


// Event Listener for add book
const form = document.querySelector('#book-form');

form.addEventListener('submit', function(e) {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Instantiate Book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();
    // Validate
    if(title === '' || author === '' || isbn === '') {
        // Error Alert
        ui.showAlert('لطفا تمامی فیلدها را پر کنید', 'error');
    } else {
        // Add book
        ui.addBookToList(book);

        // Add Book to Local Storage
        Storage.addBook(book);

        // Show Success message
        ui.showAlert('کتاب با موفقیت اضاقه شد :)', 'success');
    
        // Clear Fields
        ui.clearFields();
    }

    

    e.preventDefault();
});

// Event Listener for delete book
document.querySelector('#book-list').addEventListener('click', function(e) {
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);

    // Remove From LS
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show Delete alert
    ui.showAlert('کتاب مورد نظر حذف شد', 'success');    
    e.preventDefault();
});
