import axios from 'axios';

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
let userQuery;
let currentPage = 1;
let perPage = 15;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
});

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadBtnClick);

async function fetchApi(page = 1) {
  const response = await axios('https://pixabay.com/api/', {
    params: {
      key: import.meta.env.VITE_API_KEY,
      q: userQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: perPage,
    },
  });

  return response.data;
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

  if (userQuery) {
    currentPage = 1;
  }

  gallery.innerHTML = '';
  loader.classList.remove('hidden');

  fetchApi(currentPage)
    .then(response => {
      if (response.hits.length) {
        gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
        lightbox.refresh();
        loadMoreBtn.classList.remove('hidden');
      } else {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }
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
      evt.target.elements.searchQuery.value = '';
      loader.classList.add('hidden');
    });
  loadMoreBtn.classList.add('hidden');
}

function onLoadBtnClick() {
  currentPage += 1;
  loader.classList.remove('hidden');

  fetchApi(currentPage)
    .then(response => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
      lightbox.refresh();

      //   if ((perPageValue * currentPage) >= response.totalHits) {
      //     iziToast.info({
      //       message: "We're sorry, but you've reached the end of search results.",
      //       position: 'topRight',
      //     });
      //     loadMoreBtn.classList.add('hidden');
      //  }

      if (currentPage === Math.ceil(response.totalHits / perPage)) {
        loader.classList.add('hidden');
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
        loadMoreBtn.classList.add('hidden');
      }
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
