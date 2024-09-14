import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import './styles/Portfolio.css';
import { PortfolioContext } from './Provider'; 

export const Portfolio = () => {
  const { orders, updateOrders } = useContext(PortfolioContext);



  const fetchPortfolio = () => {
    axios.get('http://localhost:8080/portfolio')
      .then(res => {
        updateOrders(res.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err); 
      });
  };

  useEffect(() => {
    fetchPortfolio();
  }, []); 

  const sendRequest = (id) => {
    console.log(id);
    axios.post('http://localhost:8080/sell', null, {
      params: {
        transactionId: id
      }
    })
    .then(res => {
      console.log(res);
      fetchPortfolio(); // Reload the portfolio after selling
    })
    .catch(err => {
      console.error("Error during sell request:", err);
    });
  }

  return (
    <div className="portfolio-container">
      <h2>Portfolio</h2>
      <table>
        <tbody>
          {orders.map((row, index) => (
            <tr key={index}>
              <div className="stock-row">
                <div className="info">
                  <div className="company-info">
                    <span className="company-name">{row.companyName}</span>
                    <span className="company-ticker"><em>NSE - {String(row.companySymbol).toUpperCase()}</em></span><br/>
                  </div>
                  <div className="Finance-info">
                      <div className="vol">{row.volume}</div>
                      <div className="stock-details-portfolio">
                          <span className="current-value">₹{row.avgPrice}&nbsp; | </span>
                          <span className="ppl" style={{ color: row.ppl > 0 ? 'green' : 'red' }}>&nbsp; {row.ppl}%</span>
                      </div> 
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="sell" id="marketbuttonsell" onClick={() => sendRequest(row.companyId)}>Sell</button>
                </div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;


