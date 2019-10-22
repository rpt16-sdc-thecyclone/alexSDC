import styled from 'styled-components';
import StarRatings from './StarRating.jsx';

var Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  margin-top: 65px;
  @media screen and (max-width: 575px) {
    display: block;
  }
`;
var ReviewDate = styled.div`
  color: #999;
  font-size: 12px;
`;
const ReviewSection = styled.div`
  width:25%;
  div {
    margin-top: 10px;
  } 
`;
const Title = styled.div`
  font-size: 20px;
  line-height: 131%;
  margin: 10px 0 9px 0;
`;
const ReviewAttr = styled.span`
  color: #9b9b9b;
  font-weight: 200;
`;
const ReadMoreTarget = styled.span`
  display: none;
  font-weight: 200;
`;
const ReviewValue = styled.span`
  color: #777;
  /* margin-right: 10px; */
  text-transform:capitalize;
  :after {content:' | '}
  :last-child:after { content:''}
`;
const Description = styled.div`
  color: #4a4a4a;
  font-size: 13px;
  word-wrap: break-word;
  margin: 10px 0;
`;
const ReviewContent = styled.div`
  width: 75%;
`;



const Reviews = ({reviewDetails, productCondition}) => {
  console.log(reviewDetails);
  // const setStatus = function(e) {
  //   console.log(this);
  //   console.log(e.target);
  // };
  var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  if(reviewDetails.length > 0) {
    
    return <>{reviewDetails.map((rec) => {
      var created_on = new Date(rec.created_on);
      var date = `${month_names[created_on.getMonth()]} ${created_on.getDate()}, ${created_on.getFullYear()}`;
      return(
        <Wrapper key={rec.id}>
          <ReviewSection>
            <StarRatings avgRatings={rec.ratings} starName={'star'+rec.id} starSize={'small'}></StarRatings>
            <div>by <a href='#'>{rec.user.name}</a></div>
            <ReviewDate>{date}</ReviewDate>
          </ReviewSection>
          <ReviewContent>
            <Title>{rec.title}</Title>
            <Description>{rec.description.slice(0,800)}
            {/* { rec.description.length > 800 && <><span onClick={setStatus.bind(rec)}> Read full review</span>
              <ReadMoreTarget>{rec.description.slice(800)}</ReadMoreTarget></>} */}
            </Description>
            
            <div>
              <ReviewAttr>Verified purchase: </ReviewAttr>
              <ReviewValue>{rec.report_abuse.toString()}</ReviewValue>
              <ReviewAttr>Condition: </ReviewAttr>
              <ReviewValue>{productCondition}</ReviewValue>
            </div>
          </ReviewContent>
        </Wrapper>); 
    })}</>
  } else {
    return null;
  }
};

export default Reviews;

