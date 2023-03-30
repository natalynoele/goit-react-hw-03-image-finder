import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import Button from 'components/button/Button';
import Modal from 'components/modal/Modal';
import GalleryList from 'components/galleryList/GalleryList';
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
    page: 1,
    isShowModal: false,
    isLoad: true,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.searchText === '') return;
    const { items } = this.state;
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
      fetchImages(nextSearch, nextPage)
        .then(data => {
          if (data.hits.length === 0) {
              return Promise.reject(
                new Error(
                  `There are not any images according to the request ${nextSearch}`
                )
              );
          }
          this.setState(prevState => ({
            items: [...prevState.items, ...data.hits],
            status: 'resolved',
          }));
          if (items.length > 0 && data.total === data.totalHits) {
            this.setState({ isLoad: false });
          }
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  render() {
    const { items, error, status, isShowModal } = this.state;

    if (status === 'idle') {
      return (
        <div className="PageTitle">
          <h2>Are you looking for images? Just write down a request! </h2>
        </div>
      );
    }

    if (status === 'pending' && items.length === 0) {
      return (
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
      );
    }

    if (status === 'pending' && items.length > 0) {
      return (
        <div className="GalleryWrapper">
          <GalleryList items={items} openModal={this.openModal} />         
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
          <Button click={this.handleLoadMore}>Loading</Button>
        </div>
      );
    }

    if (status === 'resolved') {
      return (
        <div className="GalleryWrapper">
          <GalleryList items={items} openModal={this.openModal} />      

          {this.state.isLoad ? (
            <Button click={this.handleLoadMore}>Load More</Button>
          ) : (
            toast.info('You reached the end of the collection') && (
              <p>You reached the end of the collection</p>
            )
          )}

          {isShowModal && (
            <Modal image={this.state.selectedImage} close={this.closeModal} />
          )}
        </div>
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
