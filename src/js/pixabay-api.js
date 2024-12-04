// import { currentPage } from '../main.js';
// const API_KEY = '29882819-d1b2e59da7ad20757f8559035';

// export const params = new URLSearchParams({
//   key: API_KEY,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   page: currentPage,
//   per_page: 16,
// });

// export function fetchApi(currentPage) {
//   return fetch(`https://pixabay.com/api/?${params}`).then(response => {
//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }
//     return response.json();
//   });
// }
