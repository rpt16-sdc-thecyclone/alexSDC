import styled, { css } from 'styled-components';
import {Fragment} from 'react';
const ReviewBar = (props) => {
  const createBar = () => {
    let bar = [];
    for(let index in props.ratingDetails) {
      bar.push(
      <Fragment key={index}>
        <Star>
          <div>&#9733;</div>
        </Star>
        <Rating>{index}</Rating>
        <Review>
          <BarContainer>
            <Bar reviewPercentage={(props.ratingDetails[index]/props.noOfRatings).toFixed(2)*100}></Bar>
          </BarContainer>
        </Review>
        <ReviewCount>{props.ratingDetails[index]}</ReviewCount>
      </Fragment>)
    }
    return bar.reverse();
  };
  return (
    <Wrapper>
      {createBar()}
    </Wrapper>
  );
};

export default ReviewBar;

const Wrapper = styled.div`
  width: 75%;
  margin-left:20px;
  margin-top:0px;
  font-size: ${props => props.theme.fontSize};
  display: grid;
  grid-template-columns: 15px 10px 80% 20px;
  grid-gap: 2px;
  @media only screen and (max-width: 450px) {
    /* For mobile phones: */
    margin-left:0px;
    margin-top:20px;
  }
`;

const marginTop = (margin='8px') => {
  return `margin-top: ${margin};`;
};
 
const Star = styled.span`
  ${marginTop()}
  font-size: 0.9em;
  color: #999;
`;

const Review = styled.span`
  /* margin-top: 10px; */
  ${marginTop('10px')}
`;

const Rating = styled.span`
  /* margin-top: 8px; */
  ${marginTop()}
`;

const BarContainer = styled.div`
  width: 100%;
  background-color: #ddd;
  border-radius: 15px;
  text-align: center;
  color: white;
`;

const Bar = styled.div`
  /* width: ${props => {props.reviewPercentage+'%'}}; */
  width: ${props => props.reviewPercentage+'%'};
  height: 12px; 
  background-color: #999; 
  border-radius: 15px 0px 0px 15px;
`;

const ReviewCount = styled.span`
  ${marginTop()}
  text-align: right;
`;