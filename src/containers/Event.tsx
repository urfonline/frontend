import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet';
import convert from 'htmr';
import { elementMap } from '../components/Prose';
import styled from 'react-emotion';
import { ImageHeader } from '../components/ImageHeader';

const Content = styled.div`
  font-weight: 400;
  max-width: 660px;
  line-height: 1.5;
  font-size: 1.2em;
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

interface IProps {
  data: any;
}

function Event(props: IProps) {
  const { data: { event, loading } } = props;
  console.log(props);
  if (loading) {
    return <div>loading</div>;
  }
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
}

const ArticleQuery = gql`
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

export default graphql(ArticleQuery, {
  options: (props: any) => ({
    variables: {
      eventId: props.match.params.eventId,
    },
  }),
})(Event);
