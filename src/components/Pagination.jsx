import { useState, useEffect } from "react";
import { useHistory } from "react-router";

const Pagination = ({ currentPage, onPageChange, numPages }) => {
  const history = useHistory();
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const page = (parseInt(searchParams.get("page")) || 1) - 1;
    setPage(page);
    onPageChange(page);
  }, [history]);

  const updatePage = page => {
    setPage(page);
    onPageChange(page);
    const searchParams = new URLSearchParams({ page: page + 1 });
    history.push(`?${searchParams}`);
  };

  const numFirstPages = 6;
  const numLastPages = 2;
  const lowerBound = Math.max(page - 1, 0);
  const upperBound = Math.min(page + 2, numPages);

  const firstPages = [...Array(numPages).keys()].slice(0, Math.min(lowerBound, numFirstPages));
  const middlePages = [...Array(numPages).keys()].slice(lowerBound, Math.max(upperBound, numFirstPages));
  const lastPages = [...Array(numPages).keys()].slice(Math.max(upperBound, numPages - numLastPages));

  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <button onClick={() => updatePage(Math.max(page - 1, 0))} className="button pagination-previous">
        Prev
      </button>
      <button onClick={() => updatePage(Math.min(page + 1, numPages - 1))} className="button pagination-next">
        Next
      </button>
      <ul className="pagination-list">
        {/* first pages */}

        {firstPages.map(_page => (
          <li key={_page} onClick={() => updatePage(_page)}>
            <a
              className={`pagination-link ${page === _page ? "is-current" : ""}`}
              aria-label={`Goto page ${_page + 1}`}
            >
              {_page + 1}
            </a>
          </li>
        ))}

        {firstPages.length > 0 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}

        {middlePages.map(_page => (
          <li key={_page} onClick={() => updatePage(_page)}>
            <a
              className={`pagination-link ${page === _page ? "is-current" : ""}`}
              aria-label={`Goto page ${_page + 1}`}
            >
              {_page + 1}
            </a>
          </li>
        ))}

        {lastPages.length > 0 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}

        {/* last pages */}

        {lastPages.map(_page => (
          <li key={_page} onClick={() => updatePage(_page)}>
            <a
              className={`pagination-link ${page === _page ? "is-current" : ""}`}
              aria-label={`Goto page ${_page + 1}`}
            >
              {_page + 1}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
