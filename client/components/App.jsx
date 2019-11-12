import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { parse } from 'query-string';
import RatingsComponent from './Ratings.jsx';
import AspectsGraph from './AspectsGraph.jsx';
import Reviews from './Reviews.jsx';
import Pagination from './Pagination.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingDetails: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
      noOfRatings: 0,
      avgRatings: 0,
      reviewDetails: [],
      aspectRating: [0, 0, 0],
      productDetails: {
        productProp1: '',
        productProp2: '',
        productProp3: ''
      },
      productCondition: '',
      pagingAndSorting: {
        offset: 0,
        limit: this.pageSize,
        currentPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        noOfPages: 0
      }
    };
    this.pageSize = 5;
    this.theme = {
      fontSize: '12px;',
      fontFamily: `"Market Sans", Arial, sans-serif;`,
      linkColor: '#0654ba'
    }
  }
  componentDidMount() {
    fetch(`/ratings?prod_id=${parse(location.search).prod_id}`).then((res) => {
      return res.json();
    })
      .then((data) => {
        const reviews = data.reviews;
        const ratings = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        let totalRatings = 0;
        let aspect1RatingCount = 0, aspect2RatingCount = 0, aspect3RatingCount = 0;
        for (let i = 0; i < reviews.length; i++) {
          ratings[reviews[i].ratings]++;
          totalRatings += reviews[i].ratings;
          aspect1RatingCount += (reviews[i].isProductProp1Good === true) ? 1 : 0
          aspect2RatingCount += (reviews[i].isProductProp2Good === true) ? 1 : 0
          aspect3RatingCount += (reviews[i].isProductProp3Good === true) ? 1 : 0
        }
        const avgRatings = totalRatings / reviews.length;
        const noOfRatings = reviews.length;
        this.setState({
          ratingDetails: ratings,
          noOfRatings,
          avgRatings,
          aspectRating: [aspect1RatingCount, aspect2RatingCount, aspect3RatingCount],
          productDetails: {
            productProp1: data.productDetails.prop1,
            productProp2: data.productDetails.prop2,
            productProp3: data.productDetails.prop3
          },
          productCondition: data.productDetails.productCondition,
          pagingAndSorting: {
            offset: 0,
            limit: this.pageSize,
            currentPage: 1,
            hasPreviousPage: false,
            hasNextPage: (noOfRatings > this.pageSize),
            noOfPages: Math.ceil(noOfRatings / this.pageSize)
          }
        });
      })
      .catch((err) => {
        console.log(err);
        //TODO: Reset State
      });
    this.loadReviews();
  }
  loadReviews(offset = this.state.pagingAndSorting.offset) {
    var params = {
      prod_id: parse(location.search).prod_id,
      offset: offset,
      limit: this.pageSize
    };
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    fetch('/reviews?' + query)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          reviewDetails: data.reviews
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  setPagination(page) {
    const newPage = Object.assign({}, this.state.pagingAndSorting);
    const offset = (page - 1) * this.pageSize;
    newPage.currentPage = page;
    newPage.hasPreviousPage = (page > 1);
    newPage.hasNextPage = (page < this.state.pagingAndSorting.noOfPages);
    newPage.offset = offset;
    this.loadReviews(offset);
    this.setState({
      pagingAndSorting: newPage
    });
  }
  render() {
    const { ratingDetails,
      noOfRatings,
      avgRatings,
      aspectRating,
      productDetails,
      reviewDetails,
      productCondition,
      pagingAndSorting } = this.state;
    return (
      <>
        <GlobalStyle />
        <ThemeProvider theme={this.theme}>
        <AppContainer>
          <Header>Ratings and Reviews</Header>
          <RatingsContainer>
            <RatingsComponent
              noOfRatings={noOfRatings}
              ratingDetails={ratingDetails}
              avgRatings={avgRatings} />
          </RatingsContainer>
          <FeedBacksContainer>
            {aspectRating.map((rating, index) => <AspectsGraph key={index}
              productProp={productDetails['productProp' + (index + 1)]}
              rating={rating} noOfRatings={noOfRatings} />)}
          </FeedBacksContainer>
          <ReviewsContainer>
            <h3>Most relevant reviews</h3>
            <Reviews pageSize={this.pageSize}
              productCondition={productCondition}
              reviewDetails={reviewDetails}
              noOfRatings={noOfRatings} />
            <Pagination pagingAndSorting={pagingAndSorting}
              noOfRatings={noOfRatings}
              setPagination={this.setPagination.bind(this)}>
            </Pagination>
          </ReviewsContainer>
        </AppContainer>
        </ThemeProvider>
      </>
    );
  }
}
export default Review;


const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

const Header = styled.h2`
  grid-area: header;
  border-bottom: 1px solid #ccc;
  padding:1rem 0rem;
  /* padding-bottom:20px; 
  @media screen and (max-width: 790px) {
    padding-bottom:10px;
  } */
`;

const RatingsContainer = styled.div`
  grid-area: ratings;
  padding:2rem 0rem;
`;

const FeedBacksContainer = styled.div`
  grid-area: feedBacks;
  padding:2rem 0rem;
  /* @media screen and (max-width: 790px) {
    padding:2em;
  } */
`;

const ReviewsContainer = styled.div`
  border-top: 1px solid #ccc;
  grid-area: reviews;
  grid-column: 1 / 3;
`;

const AppContainer = styled.div`
  display: grid;
  /* margin: 4 em; */
  padding:2em;
  /* background-color:#fff; */
  border: 10px solid #ccc;
  /* grid-gap: 10px; */
  /* grid-gap:20px; */
  grid-template-columns: 49%  49%;
  grid-template-areas:
          "header header"
          "ratings feedBacks"
          "reviews  reviews";
  color: #444;
  /* font-family: "Market Sans", Arial, sans-serif; */
  font-family: ${props => props.theme.fontFamily};
  @media screen and (max-width: 790px) {
    width:100%;
    /* align-items: center; */
    /* justify-items: center; */
    grid-template-columns: 1fr;
		grid-template-areas:
                    "header"
      				      "ratings"
                    "feedBacks"
		                "reviews";
  }
`;


