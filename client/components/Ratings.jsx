import styled from 'styled-components';
import StarRating from './StarRating.jsx';
import ReviewBar from './ReviewBar.jsx';

const RatingsComponent = (props) => {
  const {ratingDetails, noOfRatings, avgRatings, avgRatings1} = props;
  return (
    <Wrapper>
      <RatingsSummary>
        <Summary>{avgRatings.toFixed(1)}</Summary>
        <RatingsSummary><StarRating starName={'name1'} avgRatings={Math.round(avgRatings)} isReadOnly = {false}/></RatingsSummary>
        <ReviewCount>{noOfRatings} product ratings</ReviewCount>
      </RatingsSummary>
      <div><ReviewBar ratingDetails={ratingDetails} noOfRatings={noOfRatings}/></div>
    </Wrapper>
  );
};
var Wrapper = styled.div`
  display: flex;
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

var ReviewCount = styled.span`
  font-size: 12px;
  width: 140px;
  font-weight: 200;
  color: #999;
  margin: 0 auto;
  display: block;
  text-align: center;
  font-family: 'Helvetica Neue';
`;
export default RatingsComponent;
