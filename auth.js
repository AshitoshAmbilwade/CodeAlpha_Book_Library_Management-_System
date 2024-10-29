function getUsersFromLocalStorage() {
    let users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUserToLocalStorage(username, password) {
    let users = getUsersFromLocalStorage();
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
}

document.getElementById('signupBtn').addEventListener('click', function() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    if (username && password) {
        saveUserToLocalStorage(username, password);
        alert("Signup successful! You can now log in.");
    } else {
        alert("Please enter valid username and password.");
    }
});


function loginUser(username, password) {
    let users = getUsersFromLocalStorage();
    
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('currentUser', username); 
        return true; 
    }
    return false; 
}

document.getElementById('loginBtn').addEventListener('click', function() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    if (username && password) {
        if (loginUser(username, password)) {
            alert("Login successful!");
            checkLoginStatus(); 
        
        } else {
            alert("Invalid username or password. Please try again.");
        }
    } 
    else {
        alert("Please enter valid username and password.");
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn'); 
    localStorage.removeItem('currentUser'); 
    checkLoginStatus(); 
});
