// src/components/ExchangeRateManager.js

import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Exchangerate.css";

const ExchangeRateManager = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states for creating a new exchange rate
  const [newRate, setNewRate] = useState({
    baseCurrency: "",
    targetCurrency: "",
    rate: "",
    date: "",
    source: "",
  });

  // States for editing exchange rates
  const [editId, setEditId] = useState(null);
  const [editRate, setEditRate] = useState({
    baseCurrency: "",
    targetCurrency: "",
    rate: "",
    date: "",
    source: "",
  });

  // States for bulk upload
  const [bulkRates, setBulkRates] = useState([
    { baseCurrency: "", targetCurrency: "", rate: "", date: "", source: "" },
  ]);
  const [bulkMessage, setBulkMessage] = useState({ success: "", error: "" });

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates();
    // eslint-disable-next-line
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/exchange-rates");
      setExchangeRates(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching exchange rates.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for new rate form
  const handleNewRateChange = (e) => {
    const { name, value } = e.target;
    setNewRate({ ...newRate, [name]: value });
  };

  // Handle input changes for edit rate form
  const handleEditRateChange = (e) => {
    const { name, value } = e.target;
    setEditRate({ ...editRate, [name]: value });
  };

  // Handle input changes for bulk upload
  const handleBulkRateChange = (index, e) => {
    const { name, value } = e.target;
    const rates = [...bulkRates];
    rates[index][name] = value;
    setBulkRates(rates);
  };

  // Add a new bulk rate row
  const addBulkRate = () => {
    setBulkRates([
      ...bulkRates,
      { baseCurrency: "", targetCurrency: "", rate: "", date: "", source: "" },
    ]);
  };

  // Remove a bulk rate row
  const removeBulkRate = (index) => {
    const rates = [...bulkRates];
    rates.splice(index, 1);
    setBulkRates(rates);
  };

  // Create a new exchange rate
  const createExchangeRate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        baseCurrency: newRate.baseCurrency.toUpperCase(),
        targetCurrency: newRate.targetCurrency.toUpperCase(),
        rate: parseFloat(newRate.rate),
        date: newRate.date,
        source: newRate.source,
      };

      // Basic validation
      if (payload.baseCurrency === payload.targetCurrency) {
        setError("Base and target currencies must differ.");
        return;
      }

      const response = await api.post("/exchange-rates", payload);
      setExchangeRates([...exchangeRates, response.data]);
      setNewRate({
        baseCurrency: "",
        targetCurrency: "",
        rate: "",
        date: "",
        source: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating exchange rate.");
    }
  };

  // Start editing a rate
  const startEdit = (rate) => {
    setEditId(rate._id);
    setEditRate({
      baseCurrency: rate.baseCurrency,
      targetCurrency: rate.targetCurrency,
      rate: rate.rate,
      date: rate.date.split("T")[0], // Assuming ISO string
      source: rate.source,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditRate({
      baseCurrency: "",
      targetCurrency: "",
      rate: "",
      date: "",
      source: "",
    });
  };

  // Update an exchange rate
  const updateExchangeRate = async (id) => {
    setError(null);
    try {
      const payload = {
        baseCurrency: editRate.baseCurrency.toUpperCase(),
        targetCurrency: editRate.targetCurrency.toUpperCase(),
        rate: parseFloat(editRate.rate),
        date: editRate.date,
        source: editRate.source,
      };

      if (payload.baseCurrency === payload.targetCurrency) {
        setError("Base and target currencies must differ.");
        return;
      }

      const response = await api.put(`/exchange-rates/${id}`, payload);

      const updatedRates = exchangeRates.map((rate) =>
        rate._id === id ? response.data : rate
      );
      setExchangeRates(updatedRates);
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating exchange rate.");
    }
  };

  // Delete an exchange rate
  const deleteExchangeRate = async (id) => {
    setError(null);
    try {
      await api.delete(`/exchange-rates/${id}`);
      const updatedRates = exchangeRates.filter((rate) => rate._id !== id);
      setExchangeRates(updatedRates);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting exchange rate.");
    }
  };

  // Bulk upsert exchange rates
  const bulkUpsert = async (e) => {
    e.preventDefault();
    setBulkMessage({ success: "", error: "" });

    // Validate bulkRates
    for (let i = 0; i < bulkRates.length; i++) {
      const rate = bulkRates[i];
      if (
        !rate.baseCurrency ||
        !rate.targetCurrency ||
        !rate.rate ||
        !rate.date ||
        !rate.source
      ) {
        setBulkMessage({
          success: "",
          error: `All fields are required in row ${i + 1}.`,
        });
        return;
      }
      if (
        rate.baseCurrency.toUpperCase() === rate.targetCurrency.toUpperCase()
      ) {
        setBulkMessage({
          success: "",
          error: `Base and target currencies must differ in row ${i + 1}.`,
        });
        return;
      }
    }

    try {
      const payload = {
        exchangeRates: bulkRates.map((rate) => ({
          baseCurrency: rate.baseCurrency.toUpperCase(),
          targetCurrency: rate.targetCurrency.toUpperCase(),
          rate: parseFloat(rate.rate),
          date: rate.date,
          source: rate.source,
        })),
      };

      const response = await api.post("/exchange-rates/bulk-upsert", payload);
      setBulkMessage({ success: response.data.message, error: "" });
      fetchExchangeRates();
      setBulkRates([
        {
          baseCurrency: "",
          targetCurrency: "",
          rate: "",
          date: "",
          source: "",
        },
      ]);
    } catch (err) {
      setBulkMessage({
        success: "",
        error: err.response?.data?.message || "Error performing bulk upsert.",
      });
    }
  };

  return (
    <div className="exchange-rate-manager">
      <h1>Exchange Rate Manager</h1>

      {/* Display Errors */}
      {error && <div className="error-message">{error}</div>}

      {/* Create New Exchange Rate */}
      <section className="create-section">
        <h2>Create New Exchange Rate</h2>
        <form onSubmit={createExchangeRate} className="form">
          <div className="form-group">
            <label>Base Currency:</label>
            <input
              type="text"
              name="baseCurrency"
              value={newRate.baseCurrency}
              onChange={handleNewRateChange}
              required
              maxLength="3"
              placeholder="e.g., USD"
            />
          </div>
          <div className="form-group">
            <label>Target Currency:</label>
            <input
              type="text"
              name="targetCurrency"
              value={newRate.targetCurrency}
              onChange={handleNewRateChange}
              required
              maxLength="3"
              placeholder="e.g., EUR"
            />
          </div>
          <div className="form-group">
            <label>Rate:</label>
            <input
              type="number"
              name="rate"
              value={newRate.rate}
              onChange={handleNewRateChange}
              required
              step="0.0001"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={newRate.date}
              onChange={handleNewRateChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Source:</label>
            <input
              type="text"
              name="source"
              value={newRate.source}
              onChange={handleNewRateChange}
              required
              placeholder="e.g., OpenExchangeRates"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </section>

      {/* Bulk Upsert Exchange Rates */}
      <section className="bulk-section">
        <h2>Bulk Upsert Exchange Rates</h2>
        <form onSubmit={bulkUpsert} className="form">
          {bulkRates.map((rate, index) => (
            <div key={index} className="bulk-row">
              <h4>Row {index + 1}</h4>
              <div className="form-group">
                <label>Base Currency:</label>
                <input
                  type="text"
                  name="baseCurrency"
                  value={rate.baseCurrency}
                  onChange={(e) => handleBulkRateChange(index, e)}
                  required
                  maxLength="3"
                  placeholder="e.g., USD"
                />
              </div>
              <div className="form-group">
                <label>Target Currency:</label>
                <input
                  type="text"
                  name="targetCurrency"
                  value={rate.targetCurrency}
                  onChange={(e) => handleBulkRateChange(index, e)}
                  required
                  maxLength="3"
                  placeholder="e.g., EUR"
                />
              </div>
              <div className="form-group">
                <label>Rate:</label>
                <input
                  type="number"
                  name="rate"
                  value={rate.rate}
                  onChange={(e) => handleBulkRateChange(index, e)}
                  required
                  step="0.0001"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={rate.date}
                  onChange={(e) => handleBulkRateChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Source:</label>
                <input
                  type="text"
                  name="source"
                  value={rate.source}
                  onChange={(e) => handleBulkRateChange(index, e)}
                  required
                  placeholder="e.g., OpenExchangeRates"
                />
              </div>
              <div className="form-group">
                {bulkRates.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeBulkRate(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <hr />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addBulkRate}
          >
            Add Another Row
          </button>
          <button type="submit" className="btn btn-success">
            Bulk Upsert
          </button>
        </form>
        {/* Bulk Upload Messages */}
        {bulkMessage.success && (
          <div className="success-message">{bulkMessage.success}</div>
        )}
        {bulkMessage.error && (
          <div className="error-message">{bulkMessage.error}</div>
        )}
      </section>

      {/* List of Exchange Rates */}
      <section className="list-section">
        <h2>Exchange Rates</h2>
        {loading ? (
          <p>Loading...</p>
        ) : exchangeRates.length === 0 ? (
          <p>No exchange rates available.</p>
        ) : (
          <table className="exchange-table">
            <thead>
              <tr>
                <th>Base Currency</th>
                <th>Target Currency</th>
                <th>Rate</th>
                <th>Date</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRates.map((rate) => (
                <tr key={rate._id}>
                  <td>
                    {editId === rate._id ? (
                      <input
                        type="text"
                        name="baseCurrency"
                        value={editRate.baseCurrency}
                        onChange={handleEditRateChange}
                        maxLength="3"
                        required
                      />
                    ) : (
                      rate.baseCurrency
                    )}
                  </td>
                  <td>
                    {editId === rate._id ? (
                      <input
                        type="text"
                        name="targetCurrency"
                        value={editRate.targetCurrency}
                        onChange={handleEditRateChange}
                        maxLength="3"
                        required
                      />
                    ) : (
                      rate.targetCurrency
                    )}
                  </td>
                  <td>
                    {editId === rate._id ? (
                      <input
                        type="number"
                        name="rate"
                        value={editRate.rate}
                        onChange={handleEditRateChange}
                        step="0.0001"
                        min="0"
                        required
                      />
                    ) : (
                      rate.rate
                    )}
                  </td>
                  <td>
                    {editId === rate._id ? (
                      <input
                        type="date"
                        name="date"
                        value={editRate.date}
                        onChange={handleEditRateChange}
                        required
                      />
                    ) : (
                      new Date(rate.date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editId === rate._id ? (
                      <input
                        type="text"
                        name="source"
                        value={editRate.source}
                        onChange={handleEditRateChange}
                        required
                      />
                    ) : (
                      rate.source
                    )}
                  </td>
                  <td>
                    {editId === rate._id ? (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateExchangeRate(rate._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning"
                          onClick={() => startEdit(rate)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteExchangeRate(rate._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ExchangeRateManager;
