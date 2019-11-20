/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import styled from 'styled-components';
import React, { Fragment } from 'react';

/*  A star rating componen which accepts mode(readOnly/editable) and rating as props * */

const StarRatings = ({
  isReadOnly, avgRatings, starName, starSize,
}) => {
  const handleRatingChange = (event) => {
    // change from const value = event.target.value
    // eslint-disable-next-line no-unused-vars
    const { value } = event.target;
    // setRating(value); Call the callback function from the parent here
  };
  const createRadioButton = () => {
    const arr = [];
    for (let i = 5; i > 0; i--) {
      arr.push(
        <Fragment key={i}>
          <Input
            type="radio"
            id="{i}-stars"
            name={starName}
            value={i}
            checked={avgRatings === i}
            onChange={(event) => handleRatingChange(event)}
            disabled={isReadOnly}
          />
          <Label for="{i}-stars" isReadOnly={isReadOnly}>&#9733;</Label>
        </Fragment>,
      );
    }
    return arr;
  };
  return (
    <Wrapper starSize={starSize} isReadOnly={isReadOnly}>
      {createRadioButton()}
    </Wrapper>
  );
};
export default StarRatings;

const Wrapper = styled.div`
  /* border:solid 1px #ccc; */
  display:flex;
  flex-direction: row-reverse;
  font-size: ${(props) => (props.starSize === 'small' ? '15px' : '20px')};/*1em;*/
  justify-content:space-around;
  padding:0 .2em;
  text-align:center;
  width:5em;
  & :checked ~ label {
    color:#f90;
  }
  & label:hover ~ label {
    color: ${(props) => (props.isReadOnly === true ? '' : '#fc0')};
    /* color: #fc0; */
  }
`;

const Label = styled.label`
  color:#ccc;
  cursor:pointer;
  :hover {
    color: ${(props) => (props.isReadOnly ? '' : '#fc0')};
  }
  :checked {
    color:#f90;
  }
`;

const Input = styled.input`
  display:none;
`;
