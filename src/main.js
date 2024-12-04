import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import { fetchApi, params } from './js/pixabay-api.js';

import createMarkup from './js/render-functions.js';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.js-load');
export let currentPage = 1;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
});

let userQuery;

loadMoreBtn.classList.add('hidden');

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadBtnClick);

const API_KEY = '29882819-d1b2e59da7ad20757f8559035';

export const params = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 16,
});

function fetchApi(page = 1) {
  return fetch(`https://pixabay.com/api/?${params}&page=${currentPage}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
  );
}

function onSearchForm(evt) {
  evt.preventDefault();
  userQuery = evt.target.elements.searchQuery.value.trim();
  if (userQuery === '') {
    iziToast.warning({
      message: 'Please enter some data',
      position: 'topRight',
    });
    return;
  }

  params.set('q', userQuery);

  gallery.innerHTML = '';
  loader.classList.remove('hidden');

  fetchApi(currentPage)
    .then(response => {
      if (response.hits.length) {
        console.log(params.toString());

        gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
        lightbox.refresh();
      } else {
        loadMoreBtn.classList.add('hidden');
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }
    })
    .catch(error => {
      console.log(error);
      loadMoreBtn.classList.add('hidden');
      iziToast.error({
        message:
          'Sorry, there are some problems with connection. Please reload the page and try again!',
        position: 'topRight',
      });
    })
    .finally(() => {
      evt.target.elements.searchQuery.value = '';
      loader.classList.add('hidden');
    });

  loadMoreBtn.classList.remove('hidden');
}

function onLoadBtnClick() {
  console.log(currentPage);

  currentPage = currentPage + 1;

  loader.classList.remove('hidden');

  fetchApi(currentPage)
    .then(response => {
      console.log(params.toString());
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
      iziToast.error({
        message:
          'Sorry, there are some problems with connection. Please reload the page and try again!',
        position: 'topRight',
      });
    })
    .finally(() => {
      loader.classList.add('hidden');
    });
}
