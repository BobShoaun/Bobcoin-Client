const Pagination = ({ page, setPage, numPages, numFirstPages, numLastPages }) => {
  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <button onClick={() => setPage(page => Math.max(page - 1, 0))} className="button pagination-previous">
        Prev
      </button>
      <button onClick={() => setPage(page => Math.min(page + 1, numPages - 1))} className="button pagination-next">
        Next
      </button>
      <ul className="pagination-list">
        {/* first pages */}

        {[...Array(numPages).keys()].slice(0, numFirstPages).map(_page => (
          <li key={_page} onClick={() => setPage(_page)}>
            <a
              className={`pagination-link ${page === _page ? "is-current" : ""}`}
              aria-label={`Goto page ${_page + 1}`}
            >
              {_page + 1}
            </a>
          </li>
        ))}

        <li>
          <span className="pagination-ellipsis">&hellip;</span>
        </li>

        {/* last pages */}

        {numPages > numFirstPages &&
          [...Array(numPages).keys()].slice(-numLastPages).map(_page => (
            <li key={_page} onClick={() => setPage(_page)}>
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
