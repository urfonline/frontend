import React from 'react';
import cx from 'classnames';
import formatDistance from 'date-fns/formatDistance';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Image from '../components/Image';
import { Helmet } from 'react-helmet';
import convert from 'htmr';
import {elementMap} from "../components/Prose/index";

interface IProps {
  data: any;
}

function Article(props: IProps) {
  const { data: { article, loading } } = props;
  console.log(props);
  if (loading) {
    return (
      <div>
        <div className={cx('ShowHeader', 'ShowHeader--loading')}>
          <div className="Container">
            <div className="ShowHeader__container">
              <div className="ShowHeader__cover" />
              <div className="ShowHeader__info" />
            </div>
          </div>
        </div>
        <div className="Container" />
      </div>
    );
  }
  return (
    <div>
      <Helmet>
        <title>{article.title}</title>
      </Helmet>
      <div className="Container">
        <article className="Article">
          <header className="Article__header">
            <h1 className="Article__title">{article.title}</h1>
            <div className="Article__byline">By {article.authors.map((author: any) => <span>{author.name ? author.name : author.username}</span>)}, published {formatDistance(new Date(), new Date(article.publishedAt))} ago</div>
            <div className="Article__featured-image">
              <Image src={article.featuredImage.resource} />
            </div>
          </header>
          <div className="Article__content Prose">
            {convert(article.bodyHtml, elementMap)}
          </div>
        </article>
      </div>
    </div>
  );
}

const ArticleQuery = gql`
  query Article($articleId: Int) {
    article(articleId: $articleId) {
      title
      slug
      publishedAt
      authors {
        name
        username
      }
      bodyHtml
      featuredImage {
        resource
      }
    }
  }
`;

export default graphql(ArticleQuery, {
  options: (props: any) => ({
    variables: {
      articleId: props.match.params.articleId,
    },
  }),
})(Article);
