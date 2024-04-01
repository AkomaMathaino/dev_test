import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [pageItems, setPageItems] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resource, setResource] = useState("posts");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Axios.get(`https://jsonplaceholder.typicode.com/${resource}`, {
      params: {
        _start: (currentPage - 1) * 20, // Start ID
        _limit: 20, // End ID
      },
    })
      .then((response) => {
        setPageItems(response.data);
        setDataKeys(Object.keys(response.data[0]));
        console.log(response.data, Object.keys(response.data[0]));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage, resource]);

  useEffect(() => {
    const calculateTotalPages = () => {
      switch (resource) {
        case "posts":
        case "albums":
          setTotalPages(5);
          break;
        case "comments":
          setTotalPages(25);
          break;
        case "photos":
          setTotalPages(250);
          break;
        case "todos":
          setTotalPages(10);
          break;
        default:
          break;
      }
    };

    calculateTotalPages();
  }, [resource]);

  return (
    <div className="App">
      <h1>Posts</h1>
      <div className="table-container">
        {pageItems.length >= 1 ? (
          <div>
            <table className="data-table">
              <thead>
                <tr>
                  {dataKeys.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.id}>
                    {dataKeys.map((key) => (
                      <td key={`${item.id}-${key}`}>{item[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="paginator-table">
              <tfoot>
                <tr>
                  <td className="arrow-box">
                    {currentPage > 1 ? (
                      <img
                        className="arrow-left"
                        src={process.env.PUBLIC_URL + "/page-left.png"}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="page-indicator">
                    <input
                      type="number"
                      className="current-page-input"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    />{" "}
                    / {totalPages}
                  </td>
                  <td className="arrow-box">
                    {currentPage < totalPages ? (
                      <img
                        className="arrow-right"
                        src={process.env.PUBLIC_URL + "/page-right.png"}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
