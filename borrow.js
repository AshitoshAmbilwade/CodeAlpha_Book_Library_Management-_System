class Borrowing {
    constructor(bookName, borrower) {
        this.bookName = bookName;
        this.borrower = borrower; 
    }
}

class Display {
    static addToBorrowingHistory(borrowing) {
        let historyTableBody = document.getElementById('historyTableBody');
        historyTableBody.innerHTML = '';
        
        let uiString = `<tr>
                            <td>${borrowing.bookName}</td>
                            <td>${borrowing.borrower.name}</td>
                            <td>${borrowing.borrower.rollNo}</td>
                            <td>${borrowing.borrower.department}</td>
                        </tr>`;
        historyTableBody.innerHTML += uiString;
    }

    static saveToLocalStorage(borrowing) {
        let borrowings = Display.getBorrowingHistoryFromLocalStorage();
        borrowings.push(borrowing);
        localStorage.setItem('borrowings', JSON.stringify(borrowings));
    }

    static getBorrowingHistoryFromLocalStorage() {
        let borrowings = localStorage.getItem('borrowings');
        if (borrowings === null) {
            return []; 
        } else {
            return JSON.parse(borrowings);
        }
    }

    static displayBorrowingHistory() {
        let borrowings = Display.getBorrowingHistoryFromLocalStorage();
        borrowings.forEach(function(borrowing) {
            Display.addToBorrowingHistory(borrowing);
        });
    }

    static populateBookSelect() {
        const bookSelect = document.getElementById('bookSelect');
        let books = Display.getBooksFromLocalStorage();

        books.forEach(function(book) {
            let option = document.createElement('option');
            option.value = book.name; 
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });
    }

    static getBooksFromLocalStorage() {
        let books = localStorage.getItem('books'); 
        if (books === null) {
            return [];
        } else {
            return JSON.parse(books); 
        }
    }
}

document.getElementById('signupBtn').addEventListener('click', () => {
    const username = prompt("Enter username for signup:");
    const password = prompt("Enter password for signup:");
    
    if (registerUser(username, password)) {
        alert("Signup successful! Please log in.");
    } else {
        alert("Username already exists. Please try another one.");
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    alert("You have logged out!");
    checkLoginStatus(); 
});

let borrowForm = document.getElementById('borrowForm');
borrowForm.addEventListener('submit', borrowFormSubmit);

function borrowFormSubmit(e) {

    let bookName = document.getElementById('bookSelect').value; 
    let borrowerName = document.getElementById('borrowerName').value;
    let rollNo = document.getElementById('rollNo').value;
    let department = document.getElementById('department').value; 

    let borrower = {
        name: borrowerName,
        rollNo: rollNo,
        department: department
    };

    let borrowing = new Borrowing(bookName, borrower); 

    Display.saveToLocalStorage(borrowing);
    Display.addToBorrowingHistory(borrowing);

    borrowForm.reset();
}

function filterBorrowingHistory() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const historyTableBody = document.getElementById('historyTableBody'); 
    const rows = historyTableBody.getElementsByTagName('tr'); 

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false; 

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(searchQuery)) {
                match = true; 
                break;
            }
        }

        rows[i].style.display = match ? '' : 'none';
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const borrowForm = document.getElementById('borrowForm');
    const userNameDisplay = document.getElementById('usernameDisplay');
    const userNameElement = document.getElementById('userName');
    const historyTableBody = document.getElementById('historyTableBody');

    const loginNav = document.getElementById('loginNav');
    const signupNav = document.getElementById('signupNav');
    const logoutNav = document.getElementById('logoutNav');
    const homeLink = document.getElementById('homeLink'); 

    if (isLoggedIn) {
        const username = localStorage.getItem('currentUser'); 
        userNameDisplay.style.display = 'block';
        userNameElement.textContent = `Welcome, ${username}`;

        loginNav.style.display = 'none'; 
        signupNav.style.display = 'none';
        logoutNav.style.display = 'block';
        homeLink.style.display = 'block'; 
        borrowForm.style.display = 'block';
        historyTableBody.style.display = '';
    } else {
        userNameDisplay.style.display = 'none';
        loginNav.style.display = 'block'; 
        signupNav.style.display = 'block'; 
        logoutNav.style.display = 'none'; 
        homeLink.style.display = 'none'; 
        borrowForm.style.display = 'none';
        historyTableBody.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    Display.displayBorrowingHistory();
    Display.populateBookSelect();
    checkLoginStatus();
});
