import styled from 'styled-components';
import StarRating from './StarRating.jsx';
import ReviewBar from './ReviewBar.jsx';

const RatingsComponent = (props) => {
  console.log('here red');
  const {ratingDetails, noOfRatings, avgRatings} = props;
  return (
    <Wrapper>
      <StyledSummary>
        <Summary>{avgRatings.toFixed(1)}</Summary>
        <RatingsSummary><StarRating starName={'name1'} avgRatings={Math.round(avgRatings)} isReadOnly = {false}/></RatingsSummary>
        <ReviewCount>{noOfRatings} product ratings</ReviewCount>
      </StyledSummary>
      <ReviewBar ratingDetails={ratingDetails} noOfRatings={noOfRatings}/>
    </Wrapper>
  );
};
var Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* flex-wrap: wrap; */
  /* width: 450px; */
  @media only screen and (max-width: 450px) {
    /* For mobile phones: */
    flex-direction: column;
    width:100%;
    > div {
      width: 100%;
      justify-content: center;
    }
  }
`;

var Summary = styled.span`
    font-size: 64px;
    color: #555;  
    /* line-height: 75%; */
    margin: 0 auto;
    padding: 0;
    display: block;
    text-align: center;
    font-weight: 100;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
`;
var RatingsSummary = styled.div`
  text-align: center;
  display: inline-block;
`;

var StyledSummary = styled.div`
  text-align: center;
  display: inline-block;
  width: 25%;
`;

var ReviewCount = styled.span`
  font-size: ${props => props.theme.fontSize};
  /* width: 140px; */
  font-weight: 200;
  color: #999;
  margin: 0 auto;
  display: block;
  text-align: center;
  font-family: 'Helvetica Neue';
`;
export default RatingsComponent;
