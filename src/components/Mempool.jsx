import { useSelector } from "react-redux";
import Transaction from "./Transaction";

const Mempool = () => {
  const { mempool } = useSelector(state => state.blockchain);

  if (!mempool)
    return (
      <section className="has-background-white mb-6 is-flex is-justify-content-center" style={{ padding: "2.5em" }}>
        <span className="material-icons-outlined mr-3 md-18">sync</span>
        <p className="subtitle is-6 has-text-centered">Loading...</p>
      </section>
    );

  if (!mempool.length)
    return (
      <section className="has-background-white mb-6 is-flex is-justify-content-center" style={{ padding: "2.5em" }}>
        <span className="material-icons-outlined mr-3 md-18">pending_actions</span>
        <p className="subtitle is-6 has-text-centered">There are currently no pending transactions...</p>
      </section>
    );

  return (
    <section>
      {mempool.map(transaction => (
        <div key={transaction.hash} className="card mb-2">
          <div className="card-content">
            <Transaction transaction={transaction} />
          </div>
        </div>
      ))}
    </section>
  );
};

export default Mempool;
