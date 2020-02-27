function createBookmark(obj) {
  let bookmarkObj = { ...obj, expanded: false };
  this.bookmarks.push(bookmarkObj);
  console.log(bookmarkObj);
}

function deleteBookmark(id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);

  return this.bookmarks;
}

function expandDescription(id) {
  let bookmarkObj = this.bookmarks.find(bookmark => bookmark.id === id);
  if (!bookmarkObj) {
    return;
  }
  bookmarkObj.expanded = !bookmarkObj.expanded;
  console.log(bookmarkObj);
}

export default {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
  createBookmark,
  deleteBookmark,
  expandDescription
};
