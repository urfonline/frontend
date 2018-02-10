import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'redux';
import Spinner from '../components/Spinner';
import {
  BlockDescription, BlockKicker, BlockTitle, BoxInner,
  BoxLink, threeSizingStyle
} from '../components/HomepageBlock';
import { css } from 'emotion';
import { Box, Flex } from 'grid-emotion';
import {AspectRatio, OneImage} from "../components/OneImage";
import {formatDistance} from "date-fns";

interface IProps {
  updateSortMethod: any; // todo
  data: any;
  sortMethod: string;
  children?: any;
}

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

function renderContent(props: IProps) {
  if (props.data.loading) {
    return <Spinner />;
  }

  if (props.data.error) {
    return <div>error</div>;
  }

  return (
    <div>
      <Flex mx={-2} wrap>
        {props.data.allArticles.edges.map((edge: ArticleEdge) => (
          <Box width={[1, 1 / 2, 1 / 3, 1 / 4]} px={2} mb={3}>
            <BoxLink
              to={`/article/${edge.node.slug}-${edge.node.articleId}`}
              className={threeSizingStyle}
              size={3}
            >
                <OneImage
                  src={edge.node.featuredImage.resource}
                  aspectRatio={AspectRatio.r16by9}
                  alt=""
                />
              <BoxInner className={articleStyles}>
                <BlockKicker><span>{edge.node.tone}</span> · <span>{formatDistance(new Date(edge.node.publishedAt), new Date())} ago</span></BlockKicker>
                <BlockTitle>{edge.node.title}</BlockTitle>
                <BlockDescription>{edge.node.shortDescription}</BlockDescription>
                {props.children && props.children}
              </BoxInner>
            </BoxLink>
          </Box>
        ))}
      </Flex>
    </div>
  );
}

function NewsAndEvents(props: IProps) {
  return (
    <div className="Container">
      <Helmet>
        <title>{`News & Events`}</title>
      </Helmet>
      <h1 className="Page__heading">{`News & Events`}</h1>

      {renderContent(props)}
    </div>
  );
}

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

export default compose(graphql<{}, {}, any>(NewsAndEventsQuery))(NewsAndEvents);
