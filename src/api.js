// form will send data object to server

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Glen';

function getBookMarks() {
  return fetch(`${BASE_URL}/bookmarks`).then(result => result.json());
}

function createBookmark(bookmark) {
  return fetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(bookmark)
  }).then(result => result.json());
}

function deleteBookmark(id) {
  return fetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE'
  }).then(result => result.json());
}

export default {
  getBookMarks,
  createBookmark,
  deleteBookmark
};
