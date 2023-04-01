import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from './searchbar/SearchBar';
import ImageGallery from './imageGallery/ImageGallery';
import Header from './header/Header';

// Are you looking for images? Just write down a request! 

class App extends Component {
  state = {
    searchText: '',   
    status: 'idle'
  };

  handleFormSubmit = searchText => {
    this.setState({ searchText});
  };

  isFetchData = statusType => {
    this.setState({ status: {statusType} })
  }

  render() {
    return (
      <div className="PageContainer">
        <SearchBar onSubmit={this.handleFormSubmit} />
        <Header status={this.isFetchData}/>
        <ImageGallery searchText={this.state.searchText} />
        <ToastContainer />
      </div>
    );
  }
}

export default App