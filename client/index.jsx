import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Review from './components/App';

const routing = (
  <Router>
    <Route path="/" component={Review} />
  </Router>
);

// eslint-disable-next-line no-undef
ReactDOM.render(routing, document.getElementById('reviews'));
