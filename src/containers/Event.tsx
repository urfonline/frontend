import React from 'react';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet';
import convert from 'htmr';
import { elementMap } from '../components/Prose';
import styled from '@emotion/styled';
import { ImageHeader } from '../components/ImageHeader';
import Spinner from '../components/Spinner';
import {useQuery} from "react-apollo-hooks";
import {RouteComponentProps} from "react-router";

const Content = styled.div`
  font-weight: 400;
  max-width: 660px;
  line-height: 1.5;
  font-size: 1em;

  & img {
    max-width: 100%;
    width: auto;
    height: auto;
  }
`;

const Byline = styled.div`
  padding-top: 0.4rem;
  font-weight: 600;
  font-size: 1.4rem;
  color: #545454;
`;

const Header = styled.header`
  font-size: 1.2rem;
`;

interface IProps extends RouteComponentProps<{eventId: string}> {

}

const Event: React.FC<IProps> = (props) => {
  const { data, loading } = useQuery(EventQuery, {
    variables: {
      eventId: props.match.params.eventId,
    }
  });

  if (loading) {
    return <Spinner />;
  }


  const {event} = data;
  return (
    <div>
      <Helmet>
        <title>{event.title}</title>
      </Helmet>
      <div>
        <article className="Article">
          <Header>
            <ImageHeader title={event.title} image={event.featuredImage} />
            <div className="Container">
              <Byline>{event.location}</Byline>
            </div>
          </Header>
          <div className="Container">
            <Content className="Prose">
              {convert(event.descriptionHtml, elementMap)}
            </Content>
          </div>
        </article>
      </div>
    </div>
  );
};

const EventQuery = gql`
  query Event($eventId: Int) {
    event(eventId: $eventId) {
      eventId
      title
      slug
      startDate
      endDate
      location
      descriptionHtml
      featuredImage {
        resource
      }
    }
  }
`;

export default Event;
