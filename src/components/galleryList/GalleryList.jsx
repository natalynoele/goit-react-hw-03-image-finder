import PropTypes from 'prop-types';
import ImageGalleryItem from 'components/imageGalleryItem/ImageGalleryItem';

const GalleryList = ({ items, openModal }) => {
  return (
    <ul className="ImageGallery">
      {items &&
        items.map(({id, webformatURL, tags,largeImageURL }) => {
          return (
            <ImageGalleryItem
              key={id}
              url={webformatURL}
              alt={tags}
              modalUrl={largeImageURL}
              clickImg={openModal}
            />
          );
        })}
    </ul>
  );
};

GalleryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
  openModal: PropTypes.func.isRequired,
}

export default GalleryList;
