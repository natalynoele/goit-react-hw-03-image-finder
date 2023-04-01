import React from 'react';
import { Component } from 'react';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import Button from 'components/button/Button';
import Modal from 'components/modal/Modal';
import GalleryList from 'components/galleryList/GalleryList';
import Header from 'components/header/Header';
import fetchImages from 'services/Api';
import './Style_ImageGallery.scss';

class ImageGallery extends Component {
  state = {
    selectedImage: {
      url: '',
      alt: '',
    },
    status: 'idle',
    error: null,
    items: [],
    perPage: 50,
    currentPage: 1,
    isShowModal: false,
    isEndOfCollection: false,
    isLoad: true,
    total: 0,
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  openModal = (url, alt) => {
    this.setState({ isShowModal: true, selectedImage: { url, alt } });
  };
  closeModal = () => {
    this.setState({ isShowModal: false, selectedImage: { url: '', alt: '' } });
  };

  getImages = async (query, page, perPage) => {
    const { items, total } = this.state;
    try {
      const images = await fetchImages(query, page, perPage);
      const data = await images.hits;
      if (data.length === 0) {
        this.setState({ status: 'rejected', isLoad: false });
        throw new Error(`Sorry, there are no images for the request ${query}`);
      }
      if (total > 0 && items.length + perPage >= images.totalHits) {
        this.setState({ isLoad: false, isEndOfCollection: true });
        toast.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      this.setState(prevState => ({
        items: [...prevState.items, ...data],
        status: 'resolved',
        total: images.totalHits,
      }));
    } catch (error) {
      this.setState({ status: 'rejected', error: error });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.searchText === '') return;
    const { perPage } = this.state;
    const prevSearch = prevProps.searchText;
    const nextSearch = this.props.searchText;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevSearch !== nextSearch) {
      this.setState({ items: [], page: 1, isLoad: true });
    }
    if (
      (prevSearch !== nextSearch && nextPage === 1) ||
      prevPage !== nextPage
    ) {
      this.setState({ status: 'pending' });
      this.getImages(nextSearch, nextPage, perPage);
    }
  }

  render() {
    const {
      items,
      error,
      status,
      total,
      isShowModal,
      isLoad,
      isEndOfCollection,
    } = this.state;

    if (status === 'idle') {
      return (
        <Header title="Are you looking for images? Just write the request!" />
      );
    }

    if (status === 'pending') {
      return (
        <>
          <Header title="Loading..." />
          <div className="GalleryWrapper">
            {items.length > 0 && (
              <GalleryList items={items} openModal={this.openModal} />
            )}
            <div className="LoaderWrap">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#5957d0"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName="LoaderWrap"
                visible={true}
              />
            </div>
            {items.length > 0 && (
              <Button click={this.handleLoadMore}>Loading</Button>
            )}
          </div>
        </>
      );
    }

    if (status === 'resolved') {
      return (
        <>
          <Header
            title={`We found ${total} images for your request "${this.props.searchText}"`}
          />
          <div className="GalleryWrapper">
            <GalleryList items={items} openModal={this.openModal} />

            {isLoad && <Button click={this.handleLoadMore}>Load More</Button>}
            {isEndOfCollection && (
              <p>
                This is the end of the collection. Didn't find anything you like
                to? Just try another request!
              </p>
            )}
            {isShowModal && (
              <Modal image={this.state.selectedImage} close={this.closeModal} />
            )}
          </div>
        </>
      );
    }
    if (status === 'rejected') {
      return (
        <p className="ErrorMessage">
          Whoops, something went wrong: {error.message}
        </p>
      );
    }
  }
}

ImageGallery.propTypes = {
  searchText: PropTypes.string,
};
export default ImageGallery;
