function fetchImages(searchText, page, perPage) {
  const ENDPOINT = 'https://pixabay.com/api/';
  const API_KEY = '33300919-40929e674b87413f155229e92';
  const options = 'image_type=photo&orientation=horizontal';
 

  const result = fetch(
    `${ENDPOINT}/?q=${searchText}&page=${page}&key=${API_KEY}&${options}&per_page=${perPage}`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      new Error(`Sorry, there are no images for the request ${searchText}`)
    );
  });
  return result;
}

export default fetchImages;
