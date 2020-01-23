/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-script-url */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import StarRatings from './StarRating.jsx';


const ReviewDescription = ({ desc }) => {
  const [moreContent, setMoreContent] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  return (
    <Description>
      <span>{desc.slice(0, 800)}</span>
      {(desc.length > 800)
      && (
        <>
          <StyledDescription
            as="a"
            href="javascript:;"
            isLink={true}
            setVisible={showReadMore}
            onClick={() => {
              setMoreContent(true);
              setShowReadMore(false);
            }}
          >
            Read full review
          </StyledDescription>
          <StyledDescription
            setVisible={moreContent}
          >
            {desc.slice(80)}
          </StyledDescription>
        </>
      )}
    </Description>
  );
};

const Reviews = ({
  // eslint-disable-next-line no-unused-vars
  reviewDetails, productCondition, pagingAndSorting, noOfRatings,
}) => {
  // changed month_names to monthNames
  const monthNames = ['Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'];
  if (reviewDetails.length > 0) {
    return (
      <>
        {reviewDetails.map((rec) => {
          const createdOn = new Date(rec.createdOn);
          const date = `${monthNames[createdOn.getMonth()]} ${createdOn.getDate()}, ${createdOn.getFullYear()}`;
          return (
            <>
              <Wrapper key={rec.id}>
                <ReviewSection>
                  <StarRatings avgRatings={rec.ratings} starName={`star${rec.id}`} starSize={'small'} />
                  <div>by <StyledDescription isLink={true}>{rec.user.name}</StyledDescription></div>
                  <ReviewDate>{date}</ReviewDate>
                </ReviewSection>
                <ReviewContent>
                  <Title>{rec.title}</Title>
                  <ReviewDescription desc={rec.description} />
                  <div>
                    <ReviewAttr>Verified purchase: </ReviewAttr>
                    <ReviewValue>{rec.report_abuse.toString()}</ReviewValue>
                    <ReviewAttr>Condition: </ReviewAttr>
                    <ReviewValue>{productCondition}</ReviewValue>
                  </div>
                </ReviewContent>
              </Wrapper>
            </>
          );
        })}
      </>
    );
  }
  return null;
};

export default Reviews;


const Wrapper = styled.div`
  display: flex;
  font-size: ${(props) => props.theme.fontSize};
  margin-top: 30px;
  @media screen and (max-width: 790px) {
    display: block;
  }
`;

const ReviewDate = styled.div`
  color: #999;
  font-size: ${(props) => props.theme.fontSize};
`;

const ReviewSection = styled.div`
  width:25%;
  div {
    margin-top: 10px;
  }
  @media screen and (max-width: 790px) {
    width: 100%;
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

const ReviewValue = styled.span`
  color: #777;
  text-transform: capitalize;
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
  @media screen and (max-width: 790px) {
    width: 100%;
  }
`;

const StyledDescription = styled.span`
  display: ${(props) => (((props).setVisible === false) ? 'none' : 'inline')};
  ${(props) => props.isLink
    && css`
    color: ${(props) => props.theme.linkColor};
    margin-left:5px;
  `};
`;
