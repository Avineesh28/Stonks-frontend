import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PortfolioContext = createContext();

export const Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderedData, setOrderedData] = useState([]);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
  const [totalCurrentAmount, setTotalCurrentAmount] = useState(0);

  const updateOrders = (newOrders) => {
    setOrders(newOrders);
  };

  const updateOrderedData = (newData) => {
    setOrderedData(newData);
  };

  useEffect(() => {
  }, []); // Fetch initial profile data on component mount

  useEffect(() => {
    let invAmt = 0; // Reset
    let curAmt = 0; // Reset
    console.log(orders)
    orders.forEach((x) => {
      if(x.volume!=0)
      {
        invAmt += x.avgPrice*x.volume; // Sum up avgPrice for all orders

        orderedData.forEach((y) => 
        {
          if (x.companyId === y.companyID) 
          {
            curAmt += parseFloat(y.AvgPrice*x.volume); // Calculate the current amount
          }
        });
      }
      else
      {
        invAmt += x.avgPrice; // Sum up avgPrice for all orders

        orderedData.forEach((y) => 
        {
          if (x.companyId === y.companyID) 
          {
            curAmt += parseFloat(y.AvgPrice); // Calculate the current amount
          }
        });
      }
    });

    // console.log('Updated Total Invested Amount:', invAmt);
    // console.log('Updated Total Current Amount:', curAmt);

    setTotalInvestedAmount(invAmt); // Update the invested amount state
    setTotalCurrentAmount(curAmt);  // Update the current amount state

    // Update the profile data with the new amounts
    // axios.put(`http://localhost:8080/profile/inv?amt=${invAmt}`).then(res => console.log('Invested Amount Updated:', res));
    // axios.put(`http://localhost:8080/profile/cur?amt=${curAmt}`).then(res => console.log('Current Amount Updated:', res));
    axios.put(`http://localhost:8080/profile/inv?amt=${invAmt}`)
    axios.put(`http://localhost:8080/profile/cur?amt=${curAmt}`)
  }, [orders, orderedData]); // Recalculate when orders or orderedData change

  return (
    <PortfolioContext.Provider value={{
      orders,
      updateOrders,
      orderedData,
      updateOrderedData,
      totalInvestedAmount,
      totalCurrentAmount,
      setTotalInvestedAmount,
      setTotalCurrentAmount
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

