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
  const card = document.querySelector('.book-col').cloneNode(true);
  card.classList.remove("d-none");

  card.querySelector('.card-header').textContent = aNewBook.title;
  card.querySelector('.card-title').textContent = aNewBook.author;
  card.querySelector('.card-text').textContent = aNewBook.pages;
  document.querySelector('.book-row').appendChild(card);

}
