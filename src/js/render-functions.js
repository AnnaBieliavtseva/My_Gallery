export default function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="photo-card">
          <a href="${largeImageURL}" class="link">
          <img src="${webformatURL}" alt="${tags}" class="photo-card-img"/></a>
          <div class="info">
          <p class="info-item">Likes: <b>${likes}</b></p>
          <p class="info-item">Views: <b>${views}</b></p>
          <p class="info-item">Comments: <b>${comments}</b></p>
          <p class="info-item">Downloads:<b>${downloads}</b></p>
          </div>
       
        </li>`
    )
    .join('');
}
