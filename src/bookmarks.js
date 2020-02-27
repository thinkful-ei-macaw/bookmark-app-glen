import api from './api.js';
import store from './store.js';

//submit fires on forms, not on buttons
//Register event listeners and render functions here
//render done first, hook up buttons and event listeners, hook up api

function generateBookMarkElement(bookmark) {
  let showDesc = bookmark.expanded
    ? `
    <div class="description-div">
    <h3>Description</h3>
    <li class="hidden hideMe">${bookmark.desc}</li>
    </div>
    <div class="url-delete-div">
    <div>
    <li class="hidden hideMe"><a href='${bookmark.url}' target ='_blank'>Website Link</a></li>
    </div>
    <div class="delete-bookmark">
    <button class="deleteBookmark" type="submit">Delete</button>
    </div>
    </div>
`
    : '';

  return `
        <section id="front-page-bookmark">
        <ul data-id='${bookmark.id}'>
        <div class="info-header">
        <div class="bookmark-title">
        <h3>Bookmark</h3>
        <li>${bookmark.title}</li>
        </div>
        <div class="bookmark-rating">
        <h3>Rating</h3>
        <li>${bookmark.rating} stars</li>
        </div>
        </div>
        <div class="bottom-buttons">
        
        </div>
        ${showDesc}
        </ul>
        </section>`;
}

function hideAndShow() {
  $('main').on('click', '.info-header', e => {
    let id = $(e.currentTarget)
      .closest('ul')
      .data('id');
    store.expandDescription(id);
    render();
  });
}

function deleteIndex() {
  $('main').on('click', '.deleteBookmark', e => {
    e.preventDefault();
    let id = $(e.currentTarget)
      .closest('ul')
      .data('id');
    api
      .deleteBookmark(id)
      .then(() => {
        store.deleteBookmark(id);
        render();
      })
      .catch(error => (store.error = error.message));
  });
}

function generateHeading() {
  const stars = [
    'All Ratings',
    'Two Stars',
    'Three Stars',
    'Four Stars',
    'Five Stars'
  ];

  const options = stars.map((star, i) => {
    let selected = i + 1 === store.filter ? 'selected' : '';
    return `<option ${selected} value='${i + 1}'>${star}</option>`;
  });

  return `

    <section id="frontPage">
    <header>My Bookmarks</header>
    <button id='addBookmark' type='button'>Add BookMark</button>
    <select name="ratings" id="ratings-select">
    ${options}
    </select> 
    </section>
    <div class="image-div">
            <img class="no-rating-holder hide-bunny" src="../src/Image/bookmark.jpeg" alt="No ratings placeholder" />
            <p class="bunny-text">I am the Bookmark Bunny!</p>
            <p class="bunny-text">Below me, I collect your Bookmarks!</p>
            </div>
 
        `;
}

//arr.map takes two parameters, item, index, compare index to store.filter, if true add selected attribute to option element inside function

function generateBookmarkPage() {
  return `
  
  <div id ="input-field">
  <header>
    <h2 id="create-a-bookmark-title">Create a Bookmark</h2>
  </header>
  <form id='createNewBookmark'>
  
   <label for="title">Title</label>
   <br>
   <input type="text" name="title-field" id="title" placeholder="Title of your bookmark" required>
   <br>
   <label for="url">URL</label>
   <br>
   <input type="url" name="url-field" id="url" placeholder="http://wwww.princesscelestia.com" required>
   <br>
   <label for="description">Description</label>
   <br>
   <textarea rows="4" maxlength="160" name="description-field" id="description" placeholder="Enter your amazing description of this bookmark here!" required></textarea>
   <br>
   <label for="rating">Rating</label>
   <br>
   <input type="number" name="rating-field" id="rating" min="1" max="5" placeholder="Rating of 1 to 5"required>
   <br>
   <div class="action-button-div">
   <button class='action-buttons' type="submit" id='create'>Submit</button>
   <button class='action-buttons' type='submit' id='cancel'>Cancel</button>
   </div>
   </form>
   </div>`;
}

function ratingsFilter() {
  $('main').on('change', '#ratings-select', event => {
    store.filter = parseInt($(event.currentTarget).val());
    render();
  });
}

function render() {
  let html = '';
  let items = store.bookmarks.filter(item => {
    return item.rating >= store.filter;
  });
  console.log(items);

  if (store.adding === true) {
    html = generateBookmarkPage();
  } else if (items.length > 0) {
    //if items.length is empty show some message, if items.length is not empty show bookmarks
    html = generateHeading();
    html += items.map(generateBookMarkElement).join('');
  } else if (items.length === 0) {
    html = generateHeading();
    html += '';
  }
  $('main').html(html);
}

function registerAddListener() {
  $('main').on('click', '#addBookmark', () => {
    store.adding = true;
    render();
  });
}

function registerCancelListener() {
  $('main').on('click', '#cancel', () => {
    store.adding = false;
    render();
  });
}

function registerSubmitListener() {
  $('main').on('submit', '#createNewBookmark', e => {
    e.preventDefault();
    let title = $('#title').val();
    let url = $('#url').val();
    let description = $('#description').val();
    let rating = $('#rating').val();
    let bookmark = {
      title: title,
      url: url,
      desc: description,
      rating: rating
    };

    api
      .createBookmark(bookmark)
      .then(resultJson => {
        store.createBookmark(resultJson);
        store.adding = false;
        render();
        console.log(resultJson);
      })
      .catch(error => (store.error = error.message)); //wait for the server to respond with the object which has the ID
  });
}

function getBookmarkAPI() {
  api
    .getBookMarks()
    .then(result => {
      store.bookmarks = result;
      render();
    })
    .catch(error => (store.error = error.message));
}

function main() {
  getBookmarkAPI();
  registerCancelListener();
  registerAddListener();
  render();
  registerSubmitListener();
  hideAndShow();
  deleteIndex();
  ratingsFilter();
}

$(main);
