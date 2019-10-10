import React from 'react';
import styled from 'styled-components';
import StarComponent from './Ratings.jsx';

const ratingsContainer = styled.div`
  grid-area: 'ratings';
`;

const feedBacksContainer = styled.div`
  grid-area: 'feedBacks';
`;

const reviewsContainer = styled.div`
  grid-area: 'reviews';
`;

const AppContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 40%  60%;
  grid-template-areas:
           "ratings feedBacks"
           "reviews  reviews";
  background-color: #fff;
  color: #444;
  @media screen and (max-width: 600px) {
  	display: grid;
		grid-template-columns: 100%;
		grid-template-areas:
      				        "ratings"
                      "feedBacks"
		                  "reviews";
		background-color: #fff;
		color: #444;
  }
`;

const App = (props) => {
  return(
    <AppContainer>
      <ratingsContainer><StarComponent/></ratingsContainer>
      <feedBacksContainer>feedbacks</feedBacksContainer>
      <reviewsContainer>reviews</reviewsContainer>
    </AppContainer>
  );
} 
export default App;
