import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useIsMountedRef from "../../hooks/useIsMountedRef";
// Material Dashboard 2 React components
import PortfolioApi from "../../Api/api";
import PortifolioNameIcon from "../Svgicon/PortifolioNameIcon";
import StockIcon from "../Svgicon/StockIcon";

const Quotes = ({ label, headerLink, symbols, showSymbol, showName }) => {
  const [quotes, setQuotes] = useState([]);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    async function getQuotes() {
      if (symbols && symbols.length > 0) {
        console.log("symbosl", symbols);
        const data =   await PortfolioApi.getQuote({ symbols });
        if (isMountedRef.current) {
          //workout data
          setQuotes(data);
        }
      }
    }
    getQuotes();
  }, [symbols, isMountedRef]);

  const marketChangeColor = (number) => {
    if (number < 0) return "red";
    else if (number > 0) return "green";
    else return "black";
  };

  return (
    <div className="portfolioList" style={{  borderBottom:"1px solid #ccc"}}>
   

         <div className="Quotes" responsive>
            <div className="headerTitle">
              <div style={{display:"flex",justifyContent:"space-between"}} >
                <div className="headerTitles">
                  <div>
                  <div style={{display:"flex"}}>
                    <div style={{margin:"10px 0px"}}>
                     <PortifolioNameIcon/>
                    </div>
                  <div style={{paddingTop:"10px"}}>
                  {headerLink ? (
                    <Link className="symbolLink" to={headerLink}>
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  </div>
                    </div>
                    <div style={{display:"flex"}}>
                    
                      <StockIcon/>
                      <div className="">
                        <p>2 Stocks</p>
                      </div>
                      
                    </div>
                    </div>
                   
                 
                 
                </div>
                <div style={{display:"flex", justifyContent:"space-between",paddingTop:"20px"}}>
                <div className="headerMarketPrice" >
                 <h6>Value</h6>
                 <p>dfg</p>
                </div>
                <div className="headerMarketChange">
                <h6>Change</h6>
                </div>
                <div className="headerMarketChange">
                <h6>Change %</h6>
                  </div>
                <div className="headerMarketChange">
                <h6>Synced on</h6>
                  </div>
                </div>
              </div>
          
            
           </div>
          </div> 
    </div>
  );
};

export default Quotes;





// {quotes.length > 0 ? (
//   quotes.map(
//     (
//       {
//         symbol,
//         shortName,
//         regularMarketPrice,
//         regularMarketChange,
//         regularMarketChangePercent,
//       },
//       index
//     ) => (
//       <div key={index}>
//         <td className="shortName">
          
//           {/* {showSymbol && (
//             <Link className="symbolLink" to={`/detailed?symbol=${symbol}`}>
//               {symbol}
//             </Link>
//           )}{" "}
//           {showName && shortName} */}
//         </td>
//         <td className="regularMarketPrice">
//           {/* { (regularMarketPrice)} */}
//         </td>
//         <td
//           className="regularMarketChange"
//           style={{ color: marketChangeColor(regularMarketChange) }}
//         >
//           {/* { (regularMarketChange)}{" "}
//           <span className="percentText">
//             ({ (regularMarketChangePercent)}%)
//           </span> */}
//         </td>
//       </div>
//     )
//   )
// ) : (
//   <div>
//     <td className="shortName">No symbols found...</td>
//     <td></td>
//     <td></td>
//   </div>
// )}
