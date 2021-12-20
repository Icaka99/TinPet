import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import themeFile from './utils/theme'
import jwtDecode from 'jwt-decode';

//Components
import Navbar from './components/Navbar';
import AuthRoute from './utils/AuthRoute';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const theme = createTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <div className="container">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<AuthRoute ><Login authenticated={authenticated} /></AuthRoute>}/>
                <Route exact path="/signup" element={<AuthRoute ><Signup authenticated={authenticated} /></AuthRoute>} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
