import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Review from './components/App.jsx';

const routing = (
  <Router>
    {/* <div> */}
      <Route path="/" component={Review} />
    {/* </div> */}
  </Router>
)
ReactDOM.render(routing, document.getElementById('reviews'));





