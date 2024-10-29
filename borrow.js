class Borrowing {
    constructor(bookName, borrower) {
        this.bookName = bookName;
        this.borrower = borrower; 
    }
}

class Display {
    static addToBorrowingHistory(borrowing) {
        const historyTableBody = document.getElementById('historyTableBody');
        const uiString = `<tr>
                            <td>${borrowing.bookName}</td>
                            <td>${borrowing.borrower.name}</td>
                            <td>${borrowing.borrower.rollNo}</td>
                            <td>${borrowing.borrower.department}</td>
                        </tr>`;
        historyTableBody.innerHTML += uiString;
    }

    static saveToLocalStorage(borrowing) {
        const borrowings = Display.getBorrowingHistoryFromLocalStorage();
        borrowings.push(borrowing);
        localStorage.setItem('borrowings', JSON.stringify(borrowings));
    }

    static getBorrowingHistoryFromLocalStorage() {
        const borrowings = localStorage.getItem('borrowings');
        return borrowings ? JSON.parse(borrowings) : []; 
    }

    static displayBorrowingHistory() {
        const borrowings = Display.getBorrowingHistoryFromLocalStorage();
        borrowings.forEach(borrowing => Display.addToBorrowingHistory(borrowing));
    }

    static populateBookSelect() {
        const bookSelect = document.getElementById('bookSelect');
        const books = Display.getBooksFromLocalStorage();

        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.name; 
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });
    }

    static getBooksFromLocalStorage() {
        const books = localStorage.getItem('books'); 
        return books ? JSON.parse(books) : []; 
    }
}

// Event listeners for signup and logout
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

// Borrow form submission
const borrowForm = document.getElementById('borrowForm');
borrowForm.addEventListener('submit', borrowFormSubmit);

function borrowFormSubmit(e) {
    e.preventDefault(); // Prevent form from submitting

    const bookName = document.getElementById('bookSelect').value; 
    const borrowerName = document.getElementById('borrowerName').value;
    const rollNo = document.getElementById('rollNo').value;
    const department = document.getElementById('department').value; 

    // Validate user input
    if (!bookName || !borrowerName || !rollNo || !department) {
        alert("Please fill out all fields.");
        return; // Stop execution if validation fails
    }

    const borrower = {
        name: borrowerName,
        rollNo: rollNo,
        department: department
    };

    const borrowing = new Borrowing(bookName, borrower); 

    Display.saveToLocalStorage(borrowing);
    Display.addToBorrowingHistory(borrowing);
    borrowForm.reset();
}

// Filtering borrowing history
function filterBorrowingHistory() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const historyTableBody = document.getElementById('historyTableBody'); 
    const rows = historyTableBody.getElementsByTagName('tr'); 

    // Reset display for all rows before filtering
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
    }

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

// Check login status
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

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    Display.displayBorrowingHistory();
    Display.populateBookSelect();
    checkLoginStatus();
});
