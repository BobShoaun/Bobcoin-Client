const Loading = () => {
  return (
    <div className="is-flex is-align-items-center is-justify-content-center m-auto" style={{ height: "100%" }}>
      <span className="material-icons-outlined md-28 mr-3 spinner">loop</span>
      <h1 className="title is-4">Just a moment...</h1>
    </div>
  );
};

export default Loading;
