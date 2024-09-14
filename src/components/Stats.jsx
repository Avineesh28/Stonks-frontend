import React, { useContext } from 'react';
import axios from 'axios';
import { PortfolioContext } from './Provider'; 
import './styles/Stats.css'
import CandleStickChart from './CandleStickChart';

const Stats = ({ stock, isExpanded}) => {
  
  const { orderedData } = useContext(PortfolioContext);
  const { updateOrders, updateOrderedData } = useContext(PortfolioContext);

  if (!orderedData || orderedData.length === 0) {
    return <div id="stats">Loading data...</div>; // or return null to render nothing
  }
  const sendRequest = (data) => {
    console.log('sending')
    axios.post('http://localhost:8080/portfolio', data)
      .then(response => {
        console.log(response);
        // Fetch updated portfolio and update the shared state
        axios.get('http://localhost:8080/portfolio')
          .then(res => {
            updateOrders(res.data); // Update orders in context
          })
          .catch(err => {
            console.error('Error fetching updated portfolio:', err);
          });
      })
      .catch(err => {
        console.error('Error sending data:', err);
      });
  };

  const handleSubmit = () =>
  {
      let a = parseInt(document.getElementById("volume").value)
      stock.Volume = a;
      console.log(stock)
      sendRequest(stock)
  }
  
  if(isExpanded==false)
  {
    const top5Stocks = orderedData.slice(0, 5);
    return (
      <div id="stats" className="stats-grid">
        {/* Uncomment these lines if you want to include the charts ~ Okay ra
        <div className="candlestick-chart">
          <CandleStickChart />
        </div>}*/}
        <div className="top-stocks">
          <h2>Top 5 Performing Stocks</h2>
          <ul className="top-stocks-list">
            {top5Stocks.map((stock, index) => (
              <li key={index} className="top5-stock-item" >
                <div className="top5-stock-info">
                  <span className="top5-stock-name">{stock.companyName}</span>&nbsp;
                  <span className="top5-stock-ppl" style={{ color: stock.PPL > 0 ? 'green' : 'red' }}>
                    {stock.PPL}%
                  </span>
                </div>
                <div className="top5-stock-details">
                  <span>High: {stock.High}</span>&nbsp;
                  <span>Low: {stock.Low}</span>&nbsp;
                  <span>Open: {stock.MarketOpen}</span>&nbsp;
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
else
{
  console.log(stock)
  return(
  <div id="stats" className="stats-grid">
      <CandleStickChart symid="ibm"/>
      <div className="stock-purchase-form">
      <h2 id="buysharesheading">Buy Shares of {stock.companyName}</h2>
        <div className="buyform">
          <div className="formbuydata">
            <p id="stockhigh">High: ₹{stock.High}</p>
            <p>Low: ₹{stock.Low}</p>
            <p>Open: ₹{stock.MarketOpen}</p>
            <p>Current Price: ₹{stock.AvgPrice}</p>
          </div>
          <div id="form">
            <input type="text" placeholder="Volume" id="volume"/>
            <button onClick={handleSubmit}>Buy Shares</button>
          </div>
        </div>
      </div>
  </div>);
}
};

export default Stats;
