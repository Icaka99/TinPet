import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import themeFile from './utils/theme'
import jwtDecode from 'jwt-decode';
import axios from 'axios';

//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//Components
import Navbar from './components/Layout/Navbar';
import AuthRoute from './utils/AuthRoute';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User from './pages/User';

const theme = createTheme(themeFile);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <Navbar />
            <div className="container">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<AuthRoute ><Login /></AuthRoute>} />
                <Route exact path="/signup" element={<AuthRoute ><Signup /></AuthRoute>} />
                <Route exact path="/users/:handle" element={<User />} />
                <Route exact path="/users/:handle/post/:postId" element={<User />} />
              </Routes>
            </div>
          </BrowserRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
