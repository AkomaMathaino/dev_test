import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [pageItems, setPageItems] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resource, setResource] = useState("posts");
  const [totalPages, setTotalPages] = useState(1);
  const [checkInput, setCheckInput] = useState(false);

  useEffect(() => {
    Axios.get(`https://jsonplaceholder.typicode.com/${resource}`, {
      params: {
        _start: (currentPage - 1) * 20, // Start ID for a page
        _limit: 20, // Limit data to 20 rows per page
      },
    })
      .then((response) => {
        setPageItems(response.data);
        setDataKeys(Object.keys(response.data[0]));
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
          setTotalPages(1);
      }
    };

    calculateTotalPages();
  }, [resource]);

  return (
    <div className="App">
      <div className="align-left">
        <select
          value={resource}
          onChange={(e) => {
            setResource(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="posts">posts</option>
          <option value="comments">comments</option>
          <option value="albums">albums</option>
          <option value="photos">photos</option>
          <option value="todos">todos</option>
          <option value="users">users</option>
        </select>
      </div>
      <h1>{resource}</h1>
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
                    {dataKeys.map((key) =>
                      String(item[key]).slice(0, 4) === "http" ? (
                        <td key={`${item.id}-${key}`}>
                          <img alt="key" src={item[key]} />
                        </td>
                      ) : (
                        <td key={`${item.id}-${key}`}>
                          {typeof item[key] === "boolean"
                            ? String(item[key])
                            : typeof item[key] === "object" &&
                              item[key] !== null
                            ? JSON.stringify(item[key])
                            : item[key]}
                        </td>
                      )
                    )}
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
                        alt="turn page left"
                        src={process.env.PUBLIC_URL + "/page-left.png"}
                        onClick={() => {
                          setCurrentPage(currentPage - 1);
                          setCheckInput(false);
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="page-indicator">
                    <input
                      type="number"
                      placeholder={currentPage}
                      className="current-page-input"
                      max={totalPages}
                      value={checkInput ? "" : currentPage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setCheckInput(true);
                        } else if (value >= 1 && value <= totalPages) {
                          setCurrentPage(parseInt(value, 10));
                          setCheckInput(false);
                        }
                      }}
                    />{" "}
                    / {totalPages}
                  </td>
                  <td className="arrow-box">
                    {currentPage < totalPages ? (
                      <img
                        className="arrow-right"
                        alt="turn page right"
                        src={process.env.PUBLIC_URL + "/page-right.png"}
                        onClick={() => {
                          setCurrentPage(currentPage + 1);
                          setCheckInput(false);
                        }}
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
