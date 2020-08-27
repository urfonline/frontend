import React from 'react';
import { Helmet } from 'react-helmet';
import gql from 'graphql-tag';
import Spinner from '../components/Spinner';
import {
  BlockDescription,
  BlockKicker,
  BlockTitle,
  BoxInner,
  BoxLink,
  threeSizingStyle,
} from '../components/HomepageBlock';
import { css } from 'emotion';
import { Box, Flex } from '@rebass/grid/emotion';
import { AspectRatio, OneImage } from '../components/OneImage';
import { QueryHookResult, useQuery } from 'react-apollo-hooks';
import dayjs from 'dayjs';

interface IProps {}

interface Article {
  articleId: number;
  title: string;
  slug: string;
  shortDescription: string;
  tone: string;
  featuredImage: {
    resource: string;
  };
  publishedAt: string;
}

interface ArticleEdge {
  node: Article;
}

const articleStyles = css`
  color: black;
`;

function renderContent(
  query: QueryHookResult<{ allArticles: { edges: ArticleEdge[] } }, {}>,
  children: any,
) {
  if (query.loading) {
    return <Spinner />;
  }

  if (query.error || !query.data) {
    return <div>error</div>;
  }

  return (
    <div>
      <Flex mx={-2} flexWrap="wrap">
        {query.data.allArticles.edges.map((edge: ArticleEdge) => (
          <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} px={2} mb={3} key={edge.node.articleId}>
            <BoxLink
              to={`/article/${edge.node.slug}-${edge.node.articleId}`}
              className={threeSizingStyle}
              size={3}
            >
              <OneImage
                src={edge.node.featuredImage?.resource || ''}
                aspectRatio={AspectRatio.r16by9}
                alt=""
              />
              <BoxInner className={articleStyles}>
                <BlockKicker>
                  <span>{edge.node.tone}</span> &middot;{' '}
                  <span>
                    {dayjs(edge.node.publishedAt).fromNow()}
                  </span>
                </BlockKicker>
                <BlockTitle>{edge.node.title}</BlockTitle>
                <BlockDescription>
                  {edge.node.shortDescription}
                </BlockDescription>
                {children && children}
              </BoxInner>
            </BoxLink>
          </Box>
        ))}
      </Flex>
    </div>
  );
}

const NewsAndEvents: React.FC<IProps> = (props) => {
  const query = useQuery(NewsAndEventsQuery);

  return (
    <div className="Container">
      <Helmet title="News & Events" />
      <h1 className="Page__heading">{`News & Events`}</h1>

      {renderContent(query, props.children)}
    </div>
  );
};

const NewsAndEventsQuery = gql`
  query {
    allArticles {
      edges {
        node {
          tone
          articleId
          slug
          title
          shortDescription
          publishedAt
          featuredImage {
            resource
          }
        }
      }
    }
    allEvents {
      edges {
        node {
          eventId
        }
      }
    }
  }
`;

export default NewsAndEvents;
