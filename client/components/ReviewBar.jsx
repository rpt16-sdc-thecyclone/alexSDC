import styled from 'styled-components';
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
  width :300px;
  font-size: 12px;
  display: grid;
  grid-template-columns: 15px 10px 80% 20px;
  grid-gap: 2px;
`;

const Star = styled.span`
  margin-top: 8px;
  font-size: 0.9em;
  color: #999;
`;

const Review = styled.span`
  margin-top: 10px;
`;

const Rating = styled.span`
  margin-top: 8px;
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
  margin-top:8px;
  text-align: right;
`;