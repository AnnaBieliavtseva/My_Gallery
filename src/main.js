import axios from 'axios';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchApi from './js/pixabay-api.js';

import createMarkup from './js/render-functions.js';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.js-load');
export let userQuery;
export let currentPage = 1;
export let perPage = 15;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
});

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadBtnClick);

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

        const card = document.querySelector('.photo-card');
        const cardHeight = card.getBoundingClientRect();
        scrollGallery(cardHeight);

        lightbox.refresh();

        if (
          response.totalHits < perPage ||
          currentPage === Math.ceil(response.totalHits / perPage)
        ) {
          loadMoreBtn.classList.add('hidden');
        } else {
          loadMoreBtn.classList.remove('hidden');
        }
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
      const card = document.querySelector('.photo-card');
      const cardHeight = card.getBoundingClientRect();
      scrollGallery(cardHeight);

      lightbox.refresh();

      //   if ((perPage * currentPage) >= response.totalHits) {
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

function scrollGallery(cardHeight) {
  window.scrollBy({
    top: 2 * cardHeight.height,
    left: 0,
    behavior: 'smooth',
  });
}
