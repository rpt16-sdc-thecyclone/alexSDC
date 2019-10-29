import styled, { css } from 'styled-components';

const Pagination = (props) => {
  const {
    pagingAndSorting,
    noOfRatings,
    setPagination
  } = props;
  const { currentPage, offset } = pagingAndSorting;
  const pages = [];
  const handleClick = function (e) {
    const pageName = e.target.getAttribute('name');
    let pageNo = +pageName;
    console.log(currentPage,'----------->');
    if (pageName === 'prev' && pagingAndSorting.hasPreviousPage) {
      setPagination(currentPage-1);
    } else if (pageName === 'next' && pagingAndSorting.hasNextPage) {
      setPagination(currentPage+1);
    } else if(Number.isInteger(pageNo)){
      setPagination(pageNo);
    }
  };
  for (let i = 1; i <= pagingAndSorting.noOfPages; i++) {
    pages.push(
      <Pages
        currentPage={currentPage === i}
        name={i}
        key={i}
        onClick={handleClick}>
        {i}
      </Pages>);
  }
  const limit = (offset+pagingAndSorting.limit > noOfRatings)?noOfRatings:offset+pagingAndSorting.limit;
  return (
    <Wrapper>
      <Description>Displaying {offset+1} - {limit} of {noOfRatings} reviews</Description>
      <span>
        <Pages
          name={'prev'}
          key={'prev'}
          isDisabled={!pagingAndSorting.hasPreviousPage}
          onClick={handleClick}>
          &laquo;
        </Pages>
        {pages}
        <Pages
          name={'next'}
          key={'next'}
          isDisabled={!pagingAndSorting.hasNextPage}
          onClick={handleClick}>
          &raquo;
        </Pages>
      </span>
    </Wrapper>
  );
};

export default Pagination;

const Pages = styled.span`
  display: inline-block;
  /* color: black; */
  padding: 8px 16px;
  /* text-decoration: none; */
  transition: background-color .3s;
  border: 1px solid #ddd;
  color: #0654ba;
  margin: 0 4px;
  cursor: pointer;
  :hover: {background-color: #ddd;}
  ${props => props.currentPage === true &&
    css`
    background-color: #dddddd;
    color: black;
  `};
  ${props => props.isDisabled === true &&
    css`
    color: grey;
    cursor: auto;
  `};
  
`;

const Description = styled.span`
  font-size: small;
  padding-right: 10px;
`;

const Wrapper = styled.div`
  border-top: 1px solid #ccc;
  padding-top: 20px;
  margin-top: 20px;
`;
