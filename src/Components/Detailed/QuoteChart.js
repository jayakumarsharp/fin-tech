import React,{ useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { Line } from 'react-chartjs-2';
import PortfolioApi from '../../Api/api';


const calculateStart = (period) => {
  let date = new Date();

  let getStart = ({
    '5D': () => date.setDate(date.getDate() - 5),
    '1M': () => date.setMonth(date.getMonth() - 1),
    '6M': () => date.setMonth(date.getMonth() - 6),
    'YTD': () => date = (new Date(`${date.getFullYear()}`, 1, 1)),
    '1Y': () => date.setFullYear(date.getFullYear() - 1),
    '5Y': () => date.setFullYear(date.getFullYear() - 5),
  })[period ?? '']();

  let start = date.toISOString().split('T')[0]
  let interval = ['5Y'].includes(period) ? '1wk' : '1d';

  return { start, interval };
}

const QuoteChart = ({ symbol, eventKey }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function getHistorical() {
      if (symbol && eventKey) {
        const { start, interval } = calculateStart(eventKey);
        let results = await PortfolioApi.getHistorical({ symbol: symbol });
        results?.success ? setResults(results.res) : setResults(null);
      }
    }
    getHistorical();
  }, [symbol, eventKey])

  const renderChart = (symbol, eventKey) => {
    const data = {
      labels: results.map(a => a.date.split('T')[0]),
      datasets: [
        {
          label: 'price',
          data: results.map(a => a.close),
          borderColor: 'gray',
        }
      ]
    }
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `${symbol} - ${eventKey}`
        },
      }
    }
    return <Line data={data} options={options} />
  }

  return (
    <Card.Text>
      {results ? renderChart(symbol, eventKey) : "No chart data!"}
    </Card.Text>
  )
}

export default QuoteChart
