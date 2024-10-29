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
        let libraryForm = document.getElementById('libraryForm');
        libraryForm.reset();
    }

    validate(book) {
        if (book.name.length < 2 || book.author.length < 2) {
            return false;
        } else {
            return true;
        }
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
        setTimeout(function () {
            message.innerHTML = '';
        }, 5000);
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
        if (books === null) {
            return [];
        } else {
            return JSON.parse(books);
        }
    }

    static displayBooksFromLocalStorage() {
        let books = Display.getBooksFromLocalStorage();
        books.forEach(function(book, index) {
            let display = new Display();
            display.add(book, index);
        });
    }
}

function deleteBook(index) {
    let books = Display.getBooksFromLocalStorage();
    books.splice(index, 1);
    Display.updateLocalStorage(books);

    let row = document.getElementById(`row-${index}`);
    row.remove();

    document.getElementById('tableBody').innerHTML = ''; 
    Display.displayBooksFromLocalStorage(); 
}


function editBook(index) {
    let books = Display.getBooksFromLocalStorage();
    let book = books[index];

    document.getElementById('bookName').value = book.name;
    document.getElementById('author').value = book.author;

    if (book.type === 'Fiction') {
        document.getElementById('fiction').checked = true;
    } else if (book.type === 'Programming') {
        document.getElementById('programming').checked = true;
    } else if (book.type === 'Novels') {
        document.getElementById('novels').checked = true;
    }

    deleteBook(index);
}

let libraryForm = document.getElementById('libraryForm');
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    console.log('You have submitted the library form');
    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let type;
    let fiction = document.getElementById('fiction');
    let programming = document.getElementById('programming');
    let novels = document.getElementById('novels');

    if (fiction.checked) {
        type = fiction.value;
    } else if (programming.checked) {
        type = programming.value;
    } else if (novels.checked) {
        type = novels.value;
    }

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

    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', Display.displayBooksFromLocalStorage);
