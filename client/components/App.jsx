import React from 'react'; 
import styled, { createGlobalStyle } from 'styled-components';
import { parse } from 'query-string';
import RatingsComponent from './Ratings.jsx';
import AspectsGraph from './AspectsGraph.jsx';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingDetails: { '1' : 0, '2' : 0, '3' : 0, '4' : 0, '5' : 0 },
      noOfRatings: 0,
      avgRatings : 0,
      reviewDetails : {}, //TODO: Remove this
      aspectRating: [ 0, 0, 0],
      productDetails : {
        productProp1: '',
        productProp2: '',
        productProp3: ''
      }
    };
  }
  componentDidMount() {
    fetch(`/reviews?prod_id=${parse(location.search).prod_id}`).then((res) => {
      return res.json();
    })
    .then((data) => {
      const reviews = data.reviews;
      const ratings = { '1' : 0, '2' : 0, '3' : 0, '4' : 0, '5' : 0 };
      let totalRatings = 0;
      let aspect1RatingCount = 0, aspect2RatingCount = 0, aspect3RatingCount = 0;
      for(let i = 0; i < reviews.length; i++) {
        ratings[reviews[i].ratings]++;
        totalRatings += reviews[i].ratings;
        aspect1RatingCount += (reviews[i].isProductProp1Good === true)?1:0
        aspect2RatingCount += (reviews[i].isProductProp2Good === true)?1:0
        aspect3RatingCount  += (reviews[i].isProductProp3Good === true)?1:0
      }
      const avgRatings = totalRatings/reviews.length;
      this.setState({
        ratingDetails: ratings,
        noOfRatings: reviews.length,
        avgRatings,
        reviewDetails : data,// TODO: Remove thhis
        aspectRating: [aspect1RatingCount, aspect2RatingCount, aspect3RatingCount],
        productDetails : {
          productProp1: data.productDetails.prop1,
          productProp2: data.productDetails.prop2,
          productProp3: data.productDetails.prop3
        }
      });
      
    })
    .catch((err) => {
      console.log(err);
      //TODO: Reset State
    });
  }
  render() {
    const {ratingDetails,
        noOfRatings, 
        avgRatings, 
        aspectRating, 
        productDetails} = this.state;
    return(
      <>
      <GlobalStyle />
      <AppContainer>
        <RatingsContainer>
          <RatingsComponent 
            noOfRatings={noOfRatings} 
            ratingDetails={ratingDetails} 
            avgRatings={avgRatings}/>
        </RatingsContainer>
        <FeedBacksContainer>
          {aspectRating.map((rating, index) => <AspectsGraph key={index} 
            productProp={productDetails['productProp'+(index+1)]} 
            rating={rating} noOfRatings={noOfRatings}/>)}
        </FeedBacksContainer>
        <ReviewsContainer></ReviewsContainer>
      </AppContainer>
      </>
    );
  }
}
export default Review;

const RatingsContainer = styled.div`
  grid-area: 'ratings';
`;

const FeedBacksContainer = styled.div`
  grid-area: 'feedBacks';
`;

const ReviewsContainer = styled.div`
  grid-area: 'reviews';
`;

const AppContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 45%  45%;
  grid-template-areas:
           "ratings feedBacks"
           "reviews  reviews";
  color: #444;
  font-family: "Market Sans", Arial, sans-serif;
  @media screen and (max-width: 768px) {
  	display: grid;
		grid-template-columns: 100%;
		grid-template-areas:
      				        "ratings"
                      "feedBacks"
		                  "reviews";
		color: #444;
  }
`;
