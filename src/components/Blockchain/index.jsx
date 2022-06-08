import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Block from "./Block";
import axios from "axios";

const Blockchain = ({ showHead, children }) => {
  const { headBlock, headBlockLoaded } = useSelector(state => state.blockchain);

  const [page, setPage] = useState(0);
  const [blockHeights, setBlockHeights] = useState([]);
  const { width } = useWindowDimensions();

  const isTablet = width > 769;
  const isDesktop = width > 1024;
  // const blocksPerPage = isDesktop ? 5 : 3;
  const heightsPerPage = 5;

  const blockchainRef = useRef(null);
  const [rerender, setRerender] = useState(0);

  const nextBlocks = () => {
    setPage(Math.max(page - 1, 0));
  };

  const prevBlocks = () => {
    setPage(page + 1);
  };

  const getBlockHeights = async () => {
    const results = await axios.get(
      `/blocks/heights?height=${headBlock.height - heightsPerPage * page}&limit=${heightsPerPage}`
    );
    setBlockHeights(results.data);
  };

  useEffect(getBlockHeights, [headBlock, page]);
  useEffect(() => setPage(0), [headBlock]);

  const loading = !headBlockLoaded;
  if (loading) return <p>Please wait...</p>;

  return (
    <section>
      <header className="is-flex mb-5" style={{ gap: "1em" }}>
        {children}

        <div>
          <button className="button is-link mr-2" style={{ gap: ".5em" }} disabled={page === 0} onClick={nextBlocks}>
            <i className="material-icons md-18">arrow_back</i>
          </button>
          <button
            className="button is-link"
            style={{ gap: ".5em" }}
            onClick={prevBlocks}
            disabled={page >= Math.floor(headBlock.height / heightsPerPage)}
          >
            <i className="material-icons md-18">arrow_forward</i>
          </button>
        </div>
      </header>

      <div
        ref={blockchainRef}
        className="is-flex h-100 px-3"
        style={{ gap: "1.75em", overflowX: "auto", overflowY: "visible" }}
      >
        {blockHeights.map(({ height, blocks }) => (
          <div key={height} style={{ flex: "1 1 30%", minWidth: "10em", maxWidth: "30%" }}>
            <h2 className="title is-6 mb-2 has-text-centered mr-3">#{height.toLocaleString()}</h2>
            {blocks
              .sort(b => (b.valid ? -1 : 1))
              .map((block, i) => (
                <div key={block.hash} className="mb-4">
                  <Block
                    block={block}
                    blockchainRef={blockchainRef}
                    selected={showHead && headBlock.hash === block.hash}
                    rerender={rerender}
                    onChange={() => setRerender(rerender + 1)}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blockchain;
