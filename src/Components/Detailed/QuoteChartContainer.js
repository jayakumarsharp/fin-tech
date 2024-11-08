import React,{ useState } from 'react';
import { Card, Tabs, Tab } from '@mui/material';
import QuoteChart from './QuoteChart';

const QuoteChartContainer = ({ symbol }) => {
  const [key, setKey] = useState('1M')

  const handleSelect = (eventKey) => {
    setKey(eventKey)
  }
  return (
    <Card className="mb-3">
      <Card.Header>
        Chart
      </Card.Header>
      <Tabs id="quote-tabs" activeKey={key} onSelect={handleSelect} >
        <Tab eventKey="1D" title="1D" disabled />
        <Tab eventKey="5D" title="5D" />
        <Tab eventKey="1M" title="1M" />
        <Tab eventKey="6M" title="6M" />
        <Tab eventKey="YTD" title="YTD" />
        <Tab eventKey="1Y" title="1Y" />
        <Tab eventKey="5Y" title="5Y" />
        <Tab eventKey="MAX" title="MAX" />
      </Tabs>
      <Card.Body>
        <QuoteChart symbol={symbol} eventKey={key} />
      </Card.Body>
    </Card>
  )
}

export default QuoteChartContainer
