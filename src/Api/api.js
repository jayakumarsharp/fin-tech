import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3003/api";

class PortfolioApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.log("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${PortfolioApi.token}` };
    const params = method === "get" ? data : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Login user */

  static async login(data) {
    let res = await this.request(`users/token`, data, "post");
    return res.token;
  }

  /** Signup user */

  static async signup(data) {
    let res = await this.request(`users/register`, data, "post");
    return res.token;
  }

  /** Get user */

  static async getUser(username) {
    let res = await this.request(`users/${username}/complete`);
    return res.user;
  }

  /** Update user */

  static async updateUser(username, data) {
    if (data.password === "") delete data.password;

    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Create a portfolio */

  static async newPortfolio(data) {
    let res = await this.request(`portfolio/createPortfolio`, data, "post");
    return res.portfolio;
  }

  /** Update portfolio */

  static async updatePortfolio(id, data) {
    let res = await this.request(`portfolio/portfolios/${id}`, data, "patch");
    return { success: true, portfolio: res.portfolio };
  }

  /** Delete a portfolio */

  static async deletePortfolio(id) {
    let res = await this.request(`portfolio/portfolios/${id}`, {}, "delete");
    return res.deleted;
  }

  /** Add a holding */

  static async addHolding(data) {
    try {
      // let res = await this.request(`security/quote`, { symbols: data.symbol }, "post");
      // if (res?.quotes?.length > 0) {
      let holding = await this.request(
        `portfoliotransactions/createTransaction`,
        data,
        "post"
      );
      return { success: true, holding };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async getHoldingbypfandsecurity(data) {
    try {
      // let res = await this.request(`security/quote`, { symbols: data.symbol }, "post");
      // if (res?.quotes?.length > 0) {
      let transactions = await this.request(
        `portfoliotransactions/getHoldingbypfandsecurity`,
        data,
        "post"
      );
      return { success: true, transactions };
      // } else {
      //   return { success: false, errors: ["Invalid symbol"] };
      // }
    } catch (errors) {
      return { success: false, errors };
    }
  }

  /** Update a holding */

  static async updateHolding(id, data) {
    let res = await this.request(`portfolio/holdings/${id}`, data, "patch");
    return { success: true, holding: res.holding };
  }

  /** Delete a holding */

  static async deleteHolding(id) {
    let res = await this.request(`portfolio/holdings/${id}`, {}, "delete");
    return res.deleted;
  }

  /** Add symbol to watchlist -- convert to update on watchlist (add / remove) */

  static async addToWatchlist(username, symbol) {
    let res = await this.request(
      `users/${username}/watchlist/${symbol}`,
      {},
      "post"
    );
    return res.watched;
  }

  static async removeFromWatchlist(username, symbol) {
    let res = await this.request(
      `users/${username}/watchlist/${symbol}`,
      {},
      "delete"
    );
    return res.unwatched;
  }

  /**  External Yahoo Finance Data */

  static async getQuote(symbols) {
    let res = await this.request(`security/quote`, symbols, "post");
    return res.quotes;
  }

  static async getQuoteSummary(symbol) {
    let res = await this.request(`security/quoteSummary`, symbol, "post");
    return res;
  }

  static async searchQuote(searchVal) {
    let res = await this.request(`security/search`, searchVal, "post");
    return res;
  }

  static async getTrendingSymbols() {
    let res = await this.request(`security/trending`);
    return res;
  }

  static async getRecommendations(searchVal) {
    try {
      let res = await this.request(`security/recommend`, { term: searchVal });
      return { success: true, res };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async getSecurities() {
    try {
      let data = await this.request(`security/securities`);
      return { success: true, data };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async getchart(chartParams) {
    try {
      let data = await this.request(`security/getchart`, chartParams, "post");
      return { success: true, data };
    } catch (errors) {
      return { success: false, errors };
    }
  }
  static async fundamentalsTimeSeries(chartParams) {
    try {
      let data = await this.request(
        `security/fundamentalsTimeSeries`,
        chartParams,
        "post"
      );
      return { success: true, res: data };
    } catch (errors) {
      return { success: false, errors };
    }
  }
  static async quotesummarydetailed(chartParams) {
    try {
      let data = await this.request(
        `security/quotesummarydetailed`,
        chartParams,
        "post"
      );
      return { success: true, res: data };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async updatesecurity(item) {
    let data = await this.request("security/updateSecuritydata", item, "post");
    return { success: true, data };
  }

  static async security(chartParams) {
    try {
      let data = await this.request(`security/security`, chartParams, "post");
      return { success: true, data };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async getHistorical(chartParams) {
    try {
      let res = await this.request(`security/historical`, chartParams, "post");
      return { success: true, res };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  static async getpricehistoryforsecurity(chartParams) {
    try {
      let data = await this.request(
        `heatMap/getpricehistoryforsecurity`,
        chartParams,
        "post"
      );
      return { success: true, res: data };
    } catch (errors) {
      return { success: false, errors };
    }
  }
  static async getATHpricelistbySymbol(chartParams) {
    try {
      let data = await this.request(
        `heatMap/getATHpricelistbySymbol`,
        chartParams,
        "post"
      );
      return { success: true, res: data };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  //currency

  /** Delete a currencies */

  static async deletecurrencies(id) {
    let data = await this.request(`currency/currencies/${id}`, {}, "delete");
    return { success: true, data };
  }

  /** update currencies */
  static async updatecurrencies(id, currencies) {
    let data = await this.request(
      `currency/currencies/${id}`,
      currencies,
      "put"
    );
    return { success: true, data };
  }

  /**  Add currencies*/

  static async addcurrencies(currencies) {
    let data = await this.request(`currency/currencies`, currencies, "post");
    return { success: true, data };
  }
  static async getcurrencies() {
    let data = await this.request(`currency/currencies`);
    return { success: true, data };
  }

  static async getAllTrancodes() {
    let data = await this.request(`currency/getAllTrancodes`);
    return { success: true, data };
  }

  /**** */

  static async deleteaccounts(id) {
    let data = await this.request(`account/accounts/${id}`, {}, "delete");
    return { success: true, data };
  }
 
  static async addaccounts(accounts, user_id) {
    let data = await this.request(
      `account/accounts`,
      { ...accounts, user_id },
      "post"
    );
    return { success: true, data };
  }

  static async getaccounts(user_id) {
    let data = await this.request(`account/accounts/${user_id}`);
    console.log(data);
    return { success: true, data };

  }
  static async updateaccounts(accounts) {
    
    let data = await this.request(
      `account/updateaccount`,
      { ...accounts },
      "post"
    );
    return { success: true, data };
  }

  static async getaccountbyId(id, user_id) {
    let data = await this.request(`account/accountsbyId/${id}`);
    return { success: true, data };
  }
  /**** */
}

export default PortfolioApi;
