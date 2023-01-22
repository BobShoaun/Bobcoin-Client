import { VCODE } from "../../config";

const MineFailureModal = ({ isOpen, close, error }) => {
  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <section className="modal-card-body p-6-tablet" style={{ borderRadius: "1em" }}>
          <div className="mb-5 is-flex is-align-items-center is-justify-content-center">
            <i className="material-icons-outlined md-36 mr-3 has-text-danger">gpp_maybe</i>
            <h3 className="title is-3">You have an invalid block!</h3>
          </div>

          <h2 className="title is-5 has-text-centered is-spaced mb-4">Here are some possible reasons:</h2>

          <ol className="subtitle is-6 mb-6 mx-5">
            <li className="mb-2">Your block is malformed. (missing data)</li>
            <li className="mb-2">You mined from an invalid branch.</li>
            <li className="mb-2">A transaction you included in the block is invalid.</li>
            <li className="mb-2">The miner's address is invalid.</li>
          </ol>

          <h2 className="title is-6 is-spaced mb-3">Error message:</h2>
          <pre className="subtitle is-6">
            {Object.keys(VCODE).find(code => VCODE[code] === error.code)}: {error.msg}
          </pre>

          <p className="help has-text-centered mb-5">*Your invalid block will be rejected by the network.</p>
          <div className="has-text-centered">
            <button onClick={close} className="button is-dark has-text-weight-semibold">
              Okay
            </button>
          </div>
        </section>
      </div>
      <button onClick={close} className="modal-close is-large" aria-label="close"></button>
    </div>
  );
};

export default MineFailureModal;
