import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'; // Ensure this line is present
import './styles/CandleStickChart.css'

const CandleStickChart = () => {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);

  let requests = [];
  useEffect(() => {
    let symid = 'ibm';
    
    if(requests.length ==0){
      for (let i = 29; i >= 0; i--) {
        requests.push(
          axios.get(
            `http://neilapi.neueda.com/API/StockFeed/GetOpenCloseMinMaxForSymbolAndPeriodNumber/${symid}?PeriodNumber=${i}`
          )
        );
      }
    }

    

    Promise.all(requests)
      .then((responses) => {
        let chartData = responses.map((response, index) => {
          const data  = response.data[0]; // Assuming response.data is an array and you're only interested in the first element
          console.log(data)
          return {
            // Using dummy dates, e.g., starting from today and going back 30 days
            x: new Date(new Date().setDate(new Date().getDate() - index)), 
            y: [data.openingPrice, data.maxPrice, data.minPrice, data.closingPrice],
          };
        });
        console.log("Hello world")
        setSeries([{ data: chartData.reverse() }]); // reverse to maintain chronological order
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
//   console.log(series)
  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
      width: 350,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        rotate: -45,
        datetimeFormatter: {
          month: 'MMM dd',
          day: 'dd MMM',
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      theme: 'dark', // Ensures the text inside tooltip is black by default
      x: {
        format: 'dd MMM yyyy',
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
      // Optionally set custom background color to ensure visibility
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        return (
          '<div style="padding: 5px; color: #000; background: #fff;">' +
          '<strong>Open:</strong> ' + o + '<br/>' +
          '<strong>High:</strong> ' + h + '<br/>' +
          '<strong>Low:</strong> ' + l + '<br/>' +
          '<strong>Close:</strong> ' + c + 
          '</div>'
        );
      }
    },
  };

  return (
    <div class='candleStick-div'>
      <Chart options={options} series={series} type="candlestick" height={600} width={900} />
    </div>
  );
};

export default CandleStickChart;