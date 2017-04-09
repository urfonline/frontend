import React from 'react';
import { gql, graphql } from 'react-apollo';

function ShowBase({ data: { show, loading }}) {
  return (
    <div>
      { loading ? (
        <h2>Loading</h2>
      ) : (
        <h1>{show.title}</h1>
      )}
    </div>
  );
}

const ShowBaseQuery = gql`
  query ShowBaseQuery($showSlug: String) {
    show(slug: $showSlug) {
      id
      title
      tone
      slug
      accentColor
    }
  }
`;

export default graphql(ShowBaseQuery, {
  options: (props) => ({
    variables: {
      showSlug: props.match.params.showSlug,
    }
  })
})(ShowBase);
