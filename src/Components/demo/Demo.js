import React from 'react';

const portfolios = [
  {
    name: 'second portfolio',
    stocks: 2,
    schemes: 0,
    value: '68,508',
    change: '-1,336',
    changePercent: '-1.9%',
    syncedOn: '05 Oct 2024',
  },
  {
    name: 'test',
    stocks: 1,
    schemes: 0,
    value: '5,546',
    change: '-82',
    changePercent: '-1.5%',
    syncedOn: '25 May 2024',
  },
];

const Demo = () => {
  return (
    <div className="my-portfolios">
      <header className="header">
        <div className="header-left">
          <button className="back-button">{"<"}</button>
          <h1>My Portfolios</h1>
        </div>
        <div className="header-right">
          <div className="icon" />
          <div className="icon" />
        </div>
      </header>

      <div className="summary-tab">
        <span>Summary</span>
        <div className="date">04 Oct 2024</div>
      </div>

      <div className="portfolio-list">
        <div className="portfolio-header">
          <span>Portfolio Name</span>
          <span>Value</span>
          <span>Change</span>
          <span>Change%</span>
          <span>Synced On</span>
        </div>

        {portfolios.map((portfolio, index) => (
          <div key={index} className="portfolio-item">
            <div className="portfolio-name">
              <div className="portfolio-icon" /> 
              <span>{portfolio.name}</span>
              <span className="portfolio-details">
                {portfolio.stocks} Stocks &middot; {portfolio.schemes} Schemes
              </span>
            </div>
            <div className="portfolio-value">{portfolio.value}</div>
            <div className={`portfolio-change ${portfolio.change.startsWith('-') ? 'negative' : 'positive'}`}>
              {portfolio.change}
            </div>
            <div className="portfolio-change-percent">{portfolio.changePercent}</div>
            <div className="portfolio-synced">{portfolio.syncedOn}</div>
          </div>
        ))}

        <div className="actions">
          <button className="manage-button">Manage</button>
          <button className="add-button">Add</button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
