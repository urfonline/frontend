import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import {compose} from "redux";

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
}

interface ArticleEdge {
  node: Article;
}

function getArticleUrl(article: { slug: string; articleId: number }) {
  return `/article/${article.slug}-${article.articleId}`;
}

function ArticleBlock(props: { article: Article }) {
  return (
    <li>
      <Link to={getArticleUrl(props.article)}>{props.article.title}</Link>
    </li>
  );
}

function renderContent(props: IProps) {
  if (props.data.loading) {
    return <div>loading</div>;
  }

  if (props.data.error) {
    return <div>error</div>;
  }

  return (
    <div>
      <ul>
        {props.data.allArticles.edges.map((edge: ArticleEdge) => (
          <ArticleBlock article={edge.node} />
        ))}
      </ul>
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
          articleId
          slug
          title
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
