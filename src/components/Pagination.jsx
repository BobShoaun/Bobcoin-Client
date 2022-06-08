import { useEffect, useRef } from "react";
import { useHistory } from "react-router";

const Pagination = ({ currentPage, onPageChange, numPages }) => {
  const history = useHistory();
  const page = currentPage;

  const pageInputRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const page = (parseInt(searchParams.get("page")) || 1) - 1;
    onPageChange(page);
  }, [history]);

  const updatePage = page => {
    onPageChange(page);
    const searchParams = new URLSearchParams({ page: page + 1 });
    history.push({ search: `?${searchParams}`, hash: history.location.hash });
    pageInputRef.current.value = page + 1;
  };

  const submitPageForm = e => {
    e.preventDefault();
    const value = pageInputRef.current.value;
    if (!isNaN(value)) updatePage(parseInt(value) - 1);
  };

  const numFirstPages = 6;
  const numLastPages = 2;
  const lowerBound = Math.max(page - 1, 0);
  const upperBound = Math.min(page + 2, numPages);

  const firstPages = [...Array(numPages).keys()].slice(0, Math.min(lowerBound, numFirstPages));
  const middlePages = [...Array(numPages).keys()].slice(lowerBound, Math.max(upperBound, numFirstPages));
  const lastPages = [...Array(numPages).keys()].slice(Math.max(upperBound, numPages - numLastPages));

  return (
    <nav className="is-flex-tablet" role="navigation" aria-label="pagination">
      <ul className="pagination-list mb-4" style={{ order: "unset" }}>
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

      <div className="is-flex is-justify-content-center" style={{ gap: ".3em" }}>
        <button onClick={() => updatePage(Math.max(page - 1, 0))} className="button fpagination-previous">
          Prev
        </button>

        <form onSubmit={submitPageForm}>
          <input
            className="input has-text-centered"
            type="text"
            inputMode="numeric"
            step={1}
            ref={pageInputRef}
            defaultValue={page + 1}
            style={{ maxWidth: "3.5em" }}
          />
        </form>

        <button onClick={() => updatePage(Math.min(page + 1, numPages - 1))} className="button fpagination-next">
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
