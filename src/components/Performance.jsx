import React, { useState, useEffect, useContext } from 'react';
import './styles/Performance.css';
import { PortfolioContext } from './Provider';
import arrowImage from '../assets/arrow.png'; // Import the arrow image
import logo from '../assets/stonksLogo.jpeg';

const Performance = () => {
  const [pc, setPc] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  const { totalInvestedAmount, totalCurrentAmount } = useContext(PortfolioContext);

  useEffect(() => {
    const calculatedPc = ((totalCurrentAmount - totalInvestedAmount) * 100) / totalInvestedAmount;
    const calculatedProfitLoss = totalCurrentAmount - totalInvestedAmount;

    setPc(calculatedPc.toFixed(2));
    setProfitLoss(calculatedProfitLoss.toFixed(2));
  }, [totalInvestedAmount, totalCurrentAmount]);

  // Determine color based on profit/loss
  const pcColor = pc >= 0 ? 'green' : 'red';

  // Extract the sign (+/-) from the profit/loss value
  const sign = profitLoss >= 0 ? '+ ' : '- ';
  const absProfitLoss = Math.abs(profitLoss).toFixed(2);

  return (
    <div className="performance-container">
      <h2 className="title">P&L</h2>
      <img src={logo} alt="logo" className="stonkslogo" />
      <div className="pl-line">
        <h5 className="amount left-amount">{totalInvestedAmount.toFixed(2)}₹</h5>
        <div className="arrow-container">
          <h3 className="pc-value" style={{ fontSize: '30px',  color: pcColor }}>{pc}%</h3>
          <img src={arrowImage} alt="arrow" className="arrow-image" />
        </div>
        <h5 className="amount right-amount">{totalCurrentAmount.toFixed(2)}₹</h5>
      </div>
      <div className="profit-loss">
        <h5>
          <span style={{ fontSize: '28px', marginRight:'5px', fontWeight: 'bold', color: pcColor }}>{sign}</span> 
          <span style={{ fontSize: '18px' }}>{absProfitLoss}₹</span>
        </h5>
      </div>
    </div>
  );
};

export default Performance;
