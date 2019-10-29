import styled from 'styled-components';

class AspectsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  drawChart() {
    const canvas  = this.canvasRef.current;
    const chart = canvas.getContext("2d");
    chart.clearRect(0, 0, canvas.width, canvas.height);
    chart.font = '21px sans-serif';
    chart.textAlign = 'center';
    chart.beginPath();
    chart.lineWidth = 8;
    chart.strokeStyle = 'rgba(241,142,0,0.2)';
    chart.arc(canvas.width/2, canvas.height/2, 40, (Math.PI*2), (Math.PI+180)*45);
    chart.stroke();
    if (this.props.rating) {
      chart.beginPath();
      chart.strokeStyle = "orange";
      const df = Math.PI * 1.5;
      const parts = (this.props.rating/this.props.noOfRatings).toFixed(2)*100;
      chart.arc(canvas.width/2, canvas.height/2 ,40, df, df + (Math.PI * 2) * (parts / 100));
      chart.stroke();
      chart.fillText(`${parts}%`, canvas.width/2, canvas.height/2+5 );
    }  
  }
  componentDidMount() {
    this.drawChart();
  }
  componentDidUpdate(prevProps) {
    if (this.props.rating !== prevProps.rating) {
      this.drawChart();
    } 
  }
  render() {
    return (
      <Aspect>
        <canvas ref={this.canvasRef} width="100" height="100" ></canvas>
        <div>{this.props.productProp}</div>
      </Aspect>
    );
  }
}

export default AspectsGraph;

var Aspect = styled.div`
  display: inline-block;
  padding: 0px 15px;
  text-align: center;
  font-size: ${props => props.theme.fontSize};
  /* font-size:12px; */
  line-height: 125%;
  color: #555;
`;