"use strict";

const submit = document.getElementById("submit");

const title = document.getElementById("title").value,
  author = document.getElementById("author").value,
  pages = document.getElementById("pages").value;

let myLibrary = [];

function newBook(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  // do stuff here
}
