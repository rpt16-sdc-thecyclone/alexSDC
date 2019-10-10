import styled from 'styled-components';
var StarComponent = (props) => {
  return (
    <StarRating class="star-rating">
      <Input type="radio" id="5-stars" name="rating" value="5" disabled/>
      <Label for="5-stars" class="star">&#9733;</Label>
      <Input type="radio" id="4-stars" name="rating" value="4" disabled/>
      <Label for="4-stars" class="star">&#9733;</Label>
      <Input type="radio" id="3-stars" name="rating" value="3" checked/>
      <Label for="3-stars" class="star">&#9733;</Label>
      <Input type="radio" id="2-stars" name="rating" value="2" />
      <Label for="2-stars" class="star">&#9733;</Label>
      <Input type="radio" id="1-star" name="rating" value="1" />
      <Label for="1-star" class="star">&#9733;</Label>
  </StarRating>
  );
}
export default StarComponent;
const StarRating = styled.div`
  border:solid 1px #ccc;
  display:flex;
  flex-direction: row-reverse;
  font-size:1.5em;
  justify-content:space-around;
  padding:0 .2em;
  text-align:center;
  width:5em;
  :checked ~ label {
    color:#f90;
  }
`;

const Input = styled.input `
  display:none;
`;

const Label = styled.label`
  color:#ccc;
  cursor:pointer;
  label:hover {
    color:#fc0;
  }
`;

// const star-rating 

// .star-rating label:hover,
// .star-rating label:hover ~ label {
//   color:#fc0;
// }


{/* <div class="star-rating">
  <input type="radio" id="5-stars" name="rating" value="5" disabled/>
  <label for="5-stars" class="star">&#9733;</label>
  <input type="radio" id="4-stars" name="rating" value="4" disabled/>
  <label for="4-stars" class="star">&#9733;</label>
  <input type="radio" id="3-stars" name="rating" value="3" checked/>
  <label for="3-stars" class="star">&#9733;</label>
  <input type="radio" id="2-stars" name="rating" value="2" />
  <label for="2-stars" class="star">&#9733;</label>
  <input type="radio" id="1-star" name="rating" value="1" />
  <label for="1-star" class="star">&#9733;</label>
</div> */}
