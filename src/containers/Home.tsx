import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TodaySchedule from '../components/TodaySchedule';

interface IProps {
  data: any;
}


function renderBlocks(props: IProps) {
  if (props.data.loading) {
    return <div>loading</div>;
  }

  if (props.data.error) {
    return <div>error</div>;
  }


  return (
    <div>
      {props.data.homepage.map((block: any) => <div>{block.position}: {block.object.__typename}, {block.object.name}</div>)}
    </div>
  );
}

function Home(props: IProps) {
  return (
    <div>
      <div className="Container">
        <h1 className="Page__heading">Home</h1>

        {renderBlocks(props)}

        <h2>Today's schedule</h2>
      </div>
      <TodaySchedule />
      <div className="Container">
        <h2>Feed</h2>
      </div>
    </div>
  );
}

const HomeQuery = gql`
  query HomeQuery {
    homepage {
      position
      object {
        __typename
        ... on Show {
          name
        }
      }
    }
  }
`;

export default graphql(HomeQuery)(Home);
