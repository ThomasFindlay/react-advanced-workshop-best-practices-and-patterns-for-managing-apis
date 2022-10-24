const Pagination = props => {
  const { page = 1, onPrev, onNext } = props;
  return (
    <div className="flex justify-center gap-3 p-4">
      <button onClick={onPrev}>Prev</button>
      <div>{page}</div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Pagination;
