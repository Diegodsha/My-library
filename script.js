const submit = document.getElementById('submit');

const myLibrary = [];

function NewBook(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(aNewBook) {
  myLibrary.push(aNewBook);
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
    bookRow.removeChild(card);
    // removes from array
    const bookIndex = myLibrary
      .map((book) => book.title)
      .indexOf(aNewBook.title);
    myLibrary.splice(bookIndex, 1);
    // remove book from local storage
    localStorage.removeItem(bookIndex);
  });
}

function createNewBookFromLocalStorage(title, author, pages, read) {
  const aNewBook = new NewBook(title, author, pages, read);
  addBookToLibrary(aNewBook);
  renderBook(aNewBook);
}

// loads previous added books
window.onload = function () {
  for (let i = 0; i < localStorage.length; i += 1) {
    const retrievedObject = localStorage.getItem(i);
    const newBookObj = JSON.parse(retrievedObject);
    createNewBookFromLocalStorage(
      newBookObj.title,
      newBookObj.author,
      newBookObj.pages,
      newBookObj.read
    );
  }
};

function createNewBook(e) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;

  e.preventDefault();

  function validateForm(title, author, pages) {
    let aNewBook;
    if (title === '' || author === '' || pages === '') {
      alert('please fill all the form');
    } else {
      aNewBook = new NewBook(title, author, pages);
      addBookToLibrary(aNewBook);

      const bookObj = {
        title: aNewBook.title,
        author: aNewBook.author,
        pages: aNewBook.pages,
        read: aNewBook.read,
      };

      // Put the object into storage
      const bookIndex = localStorage.length === 0 ? 0 : localStorage.length;
      localStorage.setItem(bookIndex.toString(), JSON.stringify(bookObj));

      const form = document.getElementById('form');
      form.reset();
      renderBook(aNewBook);
    }
  }
  validateForm(title, author, pages);
}

submit.addEventListener('click', (e) => createNewBook(e));
