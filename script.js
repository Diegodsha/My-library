"use strict";

const submit = document.getElementById("submit");

let myLibrary = [];

function newBook(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

submit.addEventListener("click", (e) => createNewBook(e));

function createNewBook(e) {
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    pages = document.getElementById("pages").value;

  e.preventDefault();
  const aNewBook = new newBook(title, author, pages);
  addBookToLibrary(aNewBook);
  const form = document.getElementById("form");
  form.reset();
  renderBook(aNewBook);
}

function addBookToLibrary(aNewBook) {
  myLibrary.push(aNewBook);
}

function renderBook(aNewBook) {
  const bookRow = document.querySelector(".book-row");
  const card = document.querySelector(".book-col").cloneNode(true);
  card.classList.remove("d-none");

  card.querySelector(".card-header").textContent = aNewBook.title;
  card.querySelector(".card-title").textContent = aNewBook.author;
  card.querySelector(".card-text").textContent = aNewBook.pages;
  document.querySelector(".book-row").appendChild(card);

  // change book status
  const readUnreadBtn = card.querySelector("#unread");

  readUnreadBtn.addEventListener("click", () => {
    if (aNewBook.read == false) {
      aNewBook.read = true;
      readUnreadBtn.textContent = "Read";
      readUnreadBtn.classList.remove("btn-warning");
      readUnreadBtn.classList.add("btn-success");
    } else {
      aNewBook.read = false;
      readUnreadBtn.textContent = "Unread";
      readUnreadBtn.classList.remove("btn-success");
      readUnreadBtn.classList.add("btn-warning");
    }
  });

  //remove buton
  const removeBtn = card.querySelector("#remove");
  // removes from view
  removeBtn.addEventListener("click", () => {
    bookRow.removeChild(card);
    // removes from array
    let bookIndex = myLibrary.map((book) => book.title).indexOf(aNewBook.title);
    myLibrary.splice(bookIndex, 1);
  });
}
