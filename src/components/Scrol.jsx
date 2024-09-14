import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Scrol.css';
import { PortfolioContext } from './Provider';

const Scrol = React.memo(({handleOnClick}) => {
  const [data, setData] = useState([]);
  const { updateOrders, updateOrderedData } = useContext(PortfolioContext);

  function capitalizeWords(str) {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  // const sendRequest = (index) => {
  //   axios.post('http://localhost:8080/portfolio', data[index])
  //     .then(response => {
  //       console.log(response);
  //       // Fetch updated portfolio and update the shared state
  //       axios.get('http://localhost:8080/portfolio')
  //         .then(res => {
  //           updateOrders(res.data); // Update orders in context
  //         })
  //         .catch(err => {
  //           console.error('Error fetching updated portfolio:', err);
  //         });
  //     })
  //     .catch(err => {
  //       console.error('Error sending data:', err);
  //     });
  // };

  let combinedData = [];

  useEffect(() => {
    let isMounted = true;

    

    if (isMounted) {
      const fetchStockData = async () => {
        try {
          const symbolListResponse = await axios.get('http://neilapi.neueda.com/API/StockFeed/GetSymbolList');
          const symbols = symbolListResponse.data.map(stock => stock.symbol);
          const limitedSymbols = symbols.slice(0, 15);
    
          const stockDataResponses = await Promise.all(
            limitedSymbols.map(symbol =>
              axios.get(`http://neilapi.neueda.com/API/StockFeed/GetOpenCloseMinMaxForSymbolAndPeriodNumber/${symbol}?PeriodNumber=1`)
            )
          );
          
          if(combinedData.length==0)
          {
            combinedData = stockDataResponses.map((response, index) => ({
            companyID: parseInt(response.data[0].symbolID, 10),
            companySymbol: String(response.data[0].symbol),
            High: parseFloat((response.data[0].maxPrice + (Math.random() * 5)).toFixed(1)),
            Low: parseFloat((response.data[0].minPrice - (Math.random() * 5)).toFixed(1)),
            MarketOpen: parseFloat(response.data[0].minPrice.toFixed(1)),
            MarketClose: parseFloat(response.data[0].maxPrice.toFixed(1)),
            DOP: null,
          }));
    
          // Fetch company names for each stock
          const companyNameResponses = await Promise.all(
            combinedData.map(data =>
              axios.get(`http://localhost:8080/stockById?id=${data.companyID}`)
            )
          );
    
          companyNameResponses.forEach((response, index) => {
            combinedData[index].companyName = capitalizeWords(response.data.companyName);
            combinedData[index].AvgPrice = parseFloat(((combinedData[index].High + combinedData[index].Low) / 2).toFixed(1));
            combinedData[index].PPL = parseFloat((((combinedData[index].AvgPrice - combinedData[index].MarketOpen) * 100) / combinedData[index].MarketOpen).toFixed(2));
          });
    
          // Sort data by PPL (top performers)
          let combinedData2 = combinedData.filter((item, index, self) =>
            index === self.findIndex((t) => t.companyID === item.companyID)
          ).sort((a, b) => b.PPL - a.PPL);
    
          // Update the state and context once
          setData(combinedData); // Update state with all data
          updateOrderedData(combinedData2); // Update ordered data in context
        }
        } catch (err) {
          console.error('Error fetching stock data:', err);
        }
      };
      fetchStockData();
    }

    return () => {
      isMounted = false;
    };
    
      
  }, []); // Ensure this runs only once on component mount
  

  return (
    <div className='scroll-container'>
      <h2>Marketplace</h2>
      <table>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.companyID}> {/* Use companyID as the key to ensure uniqueness */}
              <div className="stock-row" onClick={()=>{handleOnClick(row)}}>
                <div className="info1">
                  <div className="company-info">
                    <span className="company-name">{row.companyName}</span>
                    <span className="company-ticker"><em>NSE - {String(row.companySymbol).toUpperCase()}</em></span><br />
                  </div>
                
                  <div className="stock-details">
                    <span className="current-value">₹{row.AvgPrice}&nbsp; | </span>
                    <span className="current-ppl" style={{ color: row.PPL > 0 ? 'green' : 'red' }}>&nbsp; {row.PPL}%</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="buy" id="marketbuttonbuy">Invest</button>
                  {/* onClick={() => sendRequest(index)} */}
                </div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default Scrol;



