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
}

function addBookToLibrary(aNewBook) {
  myLibrary.push(aNewBook);
}

