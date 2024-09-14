import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './styles/Performance.css'
// Sample data
const data = [
  { stock: 'Stock1', avgPriceDay0: 137.45, prices: [193.94, 162.13, 174.97, 92.47, 206.39, 189.89, 115.48] },
  { stock: 'Stock2', avgPriceDay0: 195.07, prices: [111.82, 112.01, 126.51, 152.97, 141.83, 124.95, 163.42] },
  { stock: 'Stock3', avgPriceDay0: 173.20, prices: [106.74, 125.06, 133.96, 144.73, 184.22, 113.96, 151.71] },
  { stock: 'Stock4', avgPriceDay0: 159.87, prices: [161.09, 95.57, 162.91, 110.46, 97.81, 203.87, 205.88] },
  { stock: 'Stock5', avgPriceDay0: 115.60, prices: [187.01, 126.55, 101.72, 172.11, 142.82, 104.64, 149.42] },
  { stock: 'Stock6', avgPriceDay0: 115.60, prices: [94.13, 199.12, 121.05, 169.50, 127.41, 152.41, 155.61] },
  { stock: 'Stock7', avgPriceDay0: 105.81, prices: [112.18, 206.35, 183.02, 202.74, 197.38, 161.75, 200.62] },
];

const ChartComponentLeftMost = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const calculateProfitLoss = (data) => {
      return data.map(stockData => {
        const { avgPriceDay0, prices } = stockData;
        const profitLoss = [];

        // Calculate profit/loss for day 1
        if (prices.length > 0) {
          profitLoss.push(prices[0] - avgPriceDay0);
        }

        // Calculate profit/loss for subsequent days
        for (let i = 1; i < prices.length; i++) {
          profitLoss.push(prices[i] - prices[i - 1]);
        }

        return { stock: stockData.stock, profitLoss };
      });
    };

    const calculateOverallProfitLoss = (data) => {
      const result = calculateProfitLoss(data);

      // Determine the number of days
      const numDays = result[0].profitLoss.length;
      const overallProfitLoss = new Array(numDays).fill(0);

      // Sum profit/loss values for each day across all stocks
      result.forEach(stockData => {
        stockData.profitLoss.forEach((pnl, index) => {
          overallProfitLoss[index] += pnl;
        });
      });

      // Format data for Recharts
      return overallProfitLoss.map((pnl, index) => ({
        day: index + 1,
        profitLoss: pnl
      }));
    };

    const dataForChart = calculateOverallProfitLoss(data);
    setChartData(dataForChart);
  }, []);

  return (
    <>
    <ResponsiveContainer id="performancechart">
      <LineChart data={chartData} id="chart">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="profitLoss" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
    </>
  );
};

export default ChartComponentLeftMost;
