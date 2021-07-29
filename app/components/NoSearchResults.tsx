interface Props {
  title: number;
}

const NoSearchResults = (props: Props): JSX.Element => {
  const { title } = props;

  return (
    <div>
      {title ? (
        <span>No Search Results</span>
      ) : (
        <span>
          There was nothing to display. Please search for another term!
        </span>
      )}
    </div>
  );
};

export default NoSearchResults;
