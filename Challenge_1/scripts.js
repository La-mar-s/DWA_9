// Fully working scripts.js file

import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { BookPreview, ThemeChanger, DataListHandler } from "./book.js";

let page = 1;
let matches = books;

const starting = document.createDocumentFragment();

// preview abstraction

const startingFragment = document.createDocumentFragment();

for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = BookPreview.createPreviewElement(book);
  startingFragment.appendChild(element);
}

document.querySelector("[data-list-items]").appendChild(startingFragment);

const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement("option");
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
}

document.querySelector("[data-search-genres]").appendChild(genreHtml);

const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}

document.querySelector("[data-search-authors]").appendChild(authorsHtml);

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.querySelector("[data-settings-theme]").value = "night";
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
} else {
  document.querySelector("[data-settings-theme]").value = "day";
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
}

document.querySelector("[data-list-button]").innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`;
document.querySelector("[data-list-button]").disabled =
  matches.length - page * BOOKS_PER_PAGE < 0;

document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;

document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

//abraction done-ish (for the themeChanger)

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit",  (event) => {
  ThemeChanger.changeTheme(event);
  });
//try abstraction

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();

    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  //preview image abstraction

  for (const book of matches.slice(
    BOOKS_PER_PAGE * page,
    BOOKS_PER_PAGE * (page + 1)
  )) {
    const element = createPreviewElement(book);
    startingFragment.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(startingFragment);
  page += 1;
});

// did encapsilation here

document.querySelector("[data-list-items]").addEventListener("click", (event) => {
  DataListHandler.processDataList(event);
});
