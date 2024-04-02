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
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Retrieves data for current page depending on the resource
  useEffect(() => {
    Axios.get(`https://jsonplaceholder.typicode.com/${resource}`, {
      params: {
        _start: (currentPage - 1) * 20, // Start ID for a page
        _limit: 20, // Limit data to 20 rows per page
      },
    })
      .then((response) => {
        // Sets data for current page
        setPageItems(response.data);
        // Retrieves the keys from data object
        setDataKeys(Object.keys(response.data[0]));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage, resource]);

  // Sets total pages depending on the resource
  useEffect(() => {
    const determineTotalPages = () => {
      switch (resource) {
        case "posts":
        case "albums":
          setTotalPages(Math.ceil(100 / 20));
          break;
        case "comments":
          setTotalPages(Math.ceil(500 / 20));
          break;
        case "photos":
          setTotalPages(Math.ceil(5000 / 20));
          break;
        case "todos":
          setTotalPages(Math.ceil(200 / 20));
          break;
        default:
          setTotalPages(1);
      }
    };

    determineTotalPages();
  }, [resource]);

  return (
    <div className="App">
      <div className="flex space-between header">
        <div className="flex">
          {/* Allows users to select the resource data */}
          <h3>Select Resource:&nbsp;</h3>
          <select
            value={resource}
            className="select"
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
        <div>
          {/* Gives users context of project */}
          <img
            src={process.env.PUBLIC_URL + "/question-mark.png"}
            className="question-mark"
            alt="explanation"
            onMouseOver={() => {
              setIsTooltipVisible(true);
            }}
            onMouseOut={() => {
              setIsTooltipVisible(false);
            }}
          />
          {isTooltipVisible && (
            <div>
              <p
                className="tooltip"
                onMouseOver={() => {
                  setIsTooltipVisible(true);
                }}
                onMouseOut={() => {
                  setIsTooltipVisible(false);
                }}
              >
                This app uses React to paginate through lists of mock JSON data
                fetched from the API https://jsonplaceholder.typicode.com/. The
                development process followed the instructions provided in the
                document located{" "}
                <a
                  className="link"
                  target="_blank"
                  href="https://github.com/AkomaMathaino/dev_test/blob/main/Developer%20Test.docx"
                >
                  here
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
      <h1>{resource}</h1>
      <div>
        {/* Creates a table if there is data to be displayed */}
        {pageItems.length >= 1 ? (
          <div className="table-container">
            <table className="data-table">
              {/* Adds a header row to inform what data is in each column */}
              <thead>
                <tr>
                  {dataKeys.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Displays the data in each row according to data type using the keys retrieved */}
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
            {/* Creates a separate table for users to navigate pages */}
            <table className="paginator-table">
              <tfoot>
                <tr>
                  {/* Allows users to go to previous pages if not on the first page */}
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
                  {/* Allows users to go to a specific page, keep track of the current page, and how many there are */}
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
                  {/* Allows users to go to next page if not on the last page */}
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
