import React from 'react'; 
import { parse } from 'query-string';

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewDetails : {}
    };
  }
  componentDidMount() {
    fetch(`/reviews?prod_id=${parse(location.search).prod_id}`).then((res) => {
      return res.json();
    })
    .then((data) => {
      this.setState({
        reviewDetails : data
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  render() {
    var reviewEl;
    if(this.state.reviewDetails.reviews && this.state.reviewDetails.reviews.length > 0) {
        reviewEl = (<div>
        {this.state.reviewDetails.reviews.map((review, index) => {
          return (<div key={index}>
            <div>{review.title}</div>
            <div>{review.description}</div>
            <div>{review.ratings}</div>
          </div>)
        })}
      </div>);
    } else {
      reviewEl = (<div>Hello World</div>);
    }
    return reviewEl;
  }
}
export default Review;