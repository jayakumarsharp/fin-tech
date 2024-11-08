import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Banner from "../Banner/Banner";

const Tab = ({ label, onClick, isActive }) => (
  <div onClick={onClick}>{label}</div>
);

const Overview = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabContent = [
    { label: "Holdings", content: "This is the content of Tab 1" },
    { label: "Tab 2", content: "This is the content of Tab 2" },
    { label: "Tab 3", content: "This is the content of Tab 3" },
  ];

  return (
    <div>
      <Banner />
      <Row>
        <Col md={3}>
          <div>
            <ul>
              {tabContent.map((tab, index) => (
                <li>
                  {" "}
                  <Tab
                    key={index}
                    label={tab.label}
                    onClick={() => setActiveTab(index)}
                    isActive={activeTab === index}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {tabContent[activeTab].content}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
