import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

import Block from "./Block";
import axios from "axios";

const Blockchain = ({ showHead }) => {
  const { headBlock, headBlockLoaded, recentValidBlocks, recentValidBlocksLoaded } = useSelector(
    state => state.blockchain
  );

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

  useEffect(() => {
    setPage(0); // reset to first page
  }, [recentValidBlocks]);

  const loading = !headBlockLoaded || !recentValidBlocksLoaded;
  if (loading) return <p>Please wait...</p>;

  return (
    <section>
      <div
        ref={blockchainRef}
        className="is-flex-tablet h-100 px-3 mb-4"
        style={{ gap: "2em", overflowX: "clip", overflowY: "visible" }}
      >
        {blockHeights.map(({ height, blocks }) => (
          <div key={height} style={{ flex: "1 1 20%", minWidth: 0 }}>
            <h2 className="title is-6 mb-2 has-text-centered mr-3">#{height}</h2>
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
      <div className="has-text-right">
        <button className="button is-info mr-2 pl-3" style={{ gap: ".5em" }} disabled={page === 0} onClick={nextBlocks}>
          <i className="material-icons md-18">arrow_back</i>
          Next
        </button>
        <button
          className="button is-info pr-3"
          style={{ gap: ".5em" }}
          onClick={prevBlocks}
          disabled={page >= Math.floor(headBlock.height / heightsPerPage)}
        >
          Prev
          <i className="material-icons md-18">arrow_forward</i>
        </button>
      </div>
    </section>
  );
};

export default Blockchain;
