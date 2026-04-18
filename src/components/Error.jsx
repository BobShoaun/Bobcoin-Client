const Error = () => {
  return (
    <div
      className="is-flex is-align-items-center is-justify-content-center m-auto"
      style={{ height: "100%" }}
    >
      <h1 className="title is-4 mb-0">Could not connect to Node.</h1>
      <span className="ml-3 material-icons-outlined md-28 has-text-danger">mood_bad</span>

    </div>
  );
};

export default Error;