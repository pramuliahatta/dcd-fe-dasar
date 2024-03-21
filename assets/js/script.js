
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
}
   
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function addBook() {
    const id = generateId();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = Number(document.getElementById('year').value);
    
    const checkbox = document.getElementById('is-completed');
    const isCompleted = checkbox.checked ? true : false;
   
    const bookObject = generateBookObject(id, title, author, year, isCompleted);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(id) {
    for (const bookItem of books) {
        if (bookItem.id === id) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(id) {
    for (const index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
   
    return -1;
}

function toggleBookmark (id) {
    const bookTarget = findBook(id);

    if (bookTarget == null) return;
    
    if (bookTarget.isCompleted) {
        bookTarget.isCompleted = false;
    } else {
        bookTarget.isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(id) {
    const bookTarget = findBookIndex(id);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
    const title = document.getElementById('book-title').value;
    const unreadBook = document.getElementById('unread');
    unreadBook.innerHTML = '';

    const readBook = document.getElementById('read');
    readBook.innerHTML = '';
   
    for (const bookItem of books) {
        if (bookItem.title.includes(title)) {
            const bookElement = makeBook(bookItem);
            if (bookItem.isCompleted) {
                readBook.append(bookElement);
            } else {
                unreadBook.append(bookElement);
            }
        }
    }
}

function confirmDelete() {
    return confirm('Apa anda Yakin?');
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;
   
    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book-info');
    textContainer.append(textTitle, textAuthor, textYear);

    const innerMark = bookObject.isCompleted ? 'Unread' : 'Read';

    const markButton = document.createElement('button');
    markButton.innerText = innerMark;
    markButton.classList.add('btn', 'btn-readmark');
    
    markButton.addEventListener('click', function () {
        toggleBookmark(bookObject.id);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('btn', 'btn-delete');
    
    deleteButton.addEventListener('click', function () {
        if(confirmDelete()) {
            removeBook(bookObject.id);
        }
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('btn-group');
    buttonContainer.append(markButton, deleteButton);

    const container = document.createElement('div');
    container.classList.add('book-entries');
    container.append(textContainer, buttonContainer);
   
    return container;
  }

document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const addForm = document.getElementById('form-add');
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById('form-search');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });
});

document.addEventListener(RENDER_EVENT, function () {
    const unreadBook = document.getElementById('unread');
    unreadBook.innerHTML = '';

    const readBook = document.getElementById('read');
    readBook.innerHTML = '';
   
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            readBook.append(bookElement);
        } else {
            unreadBook.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});