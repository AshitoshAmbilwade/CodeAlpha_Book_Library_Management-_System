class Book {
    constructor(name, author, type) {
        this.name = name;
        this.author = author;
        this.type = type;
    }
}

class Display {
    add(book, index) {
        console.log("Adding to UI");
        let tableBody = document.getElementById('tableBody');
        let uiString = `<tr id="row-${index}">
                            <td>${index + 1}</td>
                            <td>${book.name}</td>
                            <td>${book.author}</td>
                            <td>${book.type}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="editBook(${index})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteBook(${index})">Delete</button>
                            </td>
                        </tr>`;
        tableBody.innerHTML += uiString;
    }

    clear() {
        document.getElementById('libraryForm').reset();
    }

    validate(book) {
        return book.name.length >= 2 && book.author.length >= 2;
    }

    show(type, displayMessage) {
        let message = document.getElementById('message');
        let boldText = type === 'success' ? 'Success' : 'Error!';
        message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                <strong>${boldText}:</strong> ${displayMessage}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>`;
        setTimeout(() => { message.innerHTML = ''; }, 5000);
    }

    static saveToLocalStorage(book) {
        let books = Display.getBooksFromLocalStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static updateLocalStorage(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    static getBooksFromLocalStorage() {
        let books = localStorage.getItem('books');
        return books === null ? [] : JSON.parse(books);
    }

    static displayBooksFromLocalStorage() {
        let books = Display.getBooksFromLocalStorage();
        books.forEach((book, index) => {
            let display = new Display();
            display.add(book, index);
        });
    }
}

function deleteBook(index) {
    let books = Display.getBooksFromLocalStorage();
    books.splice(index, 1);
    Display.updateLocalStorage(books);
    
    // Remove the row from the UI
    let row = document.getElementById(`row-${index}`);
    row.remove();
    
    // Refresh the table
    document.getElementById('tableBody').innerHTML = ''; 
    Display.displayBooksFromLocalStorage(); 
}

function editBook(index) {
    let books = Display.getBooksFromLocalStorage();
    let book = books[index];

    // Fill the form with the book details
    document.getElementById('bookName').value = book.name;
    document.getElementById('author').value = book.author;

    // Check the type radio buttons
    document.querySelector(`input[name="type"][value="${book.type}"]`).checked = true;

    // Remove the book before adding it again
    deleteBook(index);
}

let libraryForm = document.getElementById('libraryForm');
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    e.preventDefault();
    
    console.log('You have submitted the library form');
    
    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let type = document.querySelector('input[name="type"]:checked').value;

    let book = new Book(name, author, type);
    console.log(book);

    let display = new Display();

    if (display.validate(book)) {
        let books = Display.getBooksFromLocalStorage();
        display.add(book, books.length);
        display.clear();
        display.show('success', 'Your book has been successfully added');
        Display.saveToLocalStorage(book);
    } else {
        display.show('danger', 'Sorry you cannot add this book');
    }
}

// Display books when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', Display.displayBooksFromLocalStorage);
