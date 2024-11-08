import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header1 from "./Components/Header/Header1";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./Components/Overview/Overview";
import Banner from "./Components/Banner/Banner";
import Login from "./Components/Login/Login";
import Currency from "./Components/Currency/Currency";
//import ProtectedRoute from "./Components/ProtectedRoute";
import Security from "./Components/Security/Listsecuritycomponent";
import { AuthProvider } from "./context/AuthContext";
import HeatMap from "./Components/Heatmap/Heatmap";
import Portfolio from "./Components/Portfolio/Portfolio";
import PortfolioSummary from "./Components/PortfolioSummary/PortfolioSummary";
import Accounts from "./Components/Account/Accounts";
import Demo from "./Components/demo/Demo";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header1 />
        <Routes>
          <Route path="/" element={<Banner />}></Route>
          <Route path="/overview" element={<Overview />}></Route>
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/currency" element={<Currency />}></Route>
          <Route path="/security" element={<Security />}></Route>
          <Route path="/heatmap" element={<HeatMap />}></Route>
          <Route path="/accounts" element={<Accounts />}></Route>
          <Route
            path="/portfoliosummary"
            element={<PortfolioSummary />}
          ></Route>
          {/* <Route path="/accounts" element={<Overview />}></Route>
          <Route path="/resources" element={<Overview />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    // <Demo/>
  );
}

export default App;
