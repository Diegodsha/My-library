const submit = document.getElementById('submit');

const myLibrary = [];

function NewBook(title, author, pages, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}


function toggleReadInStorage(aNewBook) {
    return firebase.database().ref('/books/' + aNewBook.title).update({'read': aNewBook.read})
        .then((result) => {
            return result
        })
}

function deleteBookFromFirebase(aNewBook) {
    return firebase.database().ref('/books/' + aNewBook.title).remove()
        .then((result) => {
            return result
        })
}

function renderBook(aNewBook) {
    const bookRow = document.querySelector('.book-row');
    const card = document.querySelector('.book-col').cloneNode(true);
    card.classList.remove('d-none');

    card.querySelector('.card-header').textContent = aNewBook.title;
    card.querySelector('.card-title').textContent = aNewBook.author;
    card.querySelector('.card-text').textContent = aNewBook.pages;
    document.querySelector('.book-row').appendChild(card);

    // change book status
    const readUnreadBtn = card.querySelector('#unread');

    if (aNewBook.read === true) {
        readUnreadBtn.textContent = 'Read';
        readUnreadBtn.classList.remove('btn-warning');
        readUnreadBtn.classList.add('btn-success');
    } else {
        readUnreadBtn.textContent = 'Unread';
        readUnreadBtn.classList.remove('btn-success');
        readUnreadBtn.classList.add('btn-warning');
    }

    readUnreadBtn.addEventListener('click', () => {
        if (aNewBook.read === false) {
            aNewBook.read = true;
            readUnreadBtn.textContent = 'Read';
            readUnreadBtn.classList.remove('btn-warning');
            readUnreadBtn.classList.add('btn-success');
        } else {
            aNewBook.read = false;
            readUnreadBtn.textContent = 'Unread';
            readUnreadBtn.classList.remove('btn-success');
            readUnreadBtn.classList.add('btn-warning');
        }

        toggleReadInStorage(aNewBook)
            .then((result) => {
                console.log(result)
            })


        const bookIndex = myLibrary
            .map((book) => book.title)
            .indexOf(aNewBook.title);
        // update book read state in local storage
        localStorage.setItem(bookIndex.toString(), JSON.stringify(aNewBook));
    });

    // remove button
    const removeBtn = card.querySelector('#remove');
    // removes from view
    removeBtn.addEventListener('click', () => {

        deleteBookFromFirebase(aNewBook)
            .then((result) => {
                console.log(result)
            });

        bookRow.removeChild(card);
    });
}


function createNewBookFromStorage(title, author, pages, read) {
    const aNewBook = new NewBook(title, author, pages, read);
    renderBook(aNewBook);
}

// loads previous added books
window.onload = function () {
    getBooksFromFirebase();
};

function validateForm(title, author, pages) {
    if (title === '' || author === '' || pages === '') {
        return false;
    } else {
        return true;
    }
}

function createNewBook(e) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    e.preventDefault();
    if (validateForm(title, author, pages)) {
        let aNewBook = new NewBook(title, author, pages);

        //Put the object in firebase storage
        sendBookToFirebase(aNewBook);

        const form = document.getElementById('form');
        form.reset();
        renderBook(aNewBook);
    } else {
        alert('All fields must be filled');
    }
}

submit.addEventListener('click', (e) => createNewBook(e));


function sendBookToFirebase(aNewBook) {
    checkIfBookExists('books', aNewBook.title)
        .then((check) => {
            if (check) {
                console.log('Book already exists');
                alert('Book already exists');
            } else {
                firebase.database().ref('books/' + aNewBook.title).set({
                        title: aNewBook.title,
                        author: aNewBook.author,
                        pages: aNewBook.pages,
                        read: aNewBook.read
                    }, (error) => {
                        if (error) {
                            alert('The book could not be saved. Please try again')
                        } else {
                            // Data saved successfully!
                        }
                    }
                );
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


function checkIfBookExists(dbName = 'books', bookName) {
    const dbRef = firebase.database().ref();
    return dbRef.child(dbName).child(bookName).get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                return true;
            } else {
                console.warn("There's no book with that name in the DB");
                return false;
            }
        })
}


function getBooksFromFirebase() {
    const dbRef = firebase.database().ref();
    dbRef.child("books").get()
        .then(snapshot => {
            if (snapshot.exists()) {
                const newBookObj = snapshotToArray(snapshot);
                newBookObj.forEach(function (bookDetails) {
                    createNewBookFromStorage(
                        bookDetails.title,
                        bookDetails.author,
                        bookDetails.pages,
                        bookDetails.read,
                    );
                });
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


function snapshotToArray(snapshot) {

    //This line also returns an array
    return Object.values(snapshot.val())

    // var returnArr = [];
    // snapshot.forEach(function(childSnapshot) {
    //   var item = childSnapshot.val();
    //   item.key = childSnapshot.key;
    //   returnArr.push(item);
    // });
    // return returnArr;
};