import React from 'react';
import formatDistance from 'date-fns/formatDistance';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet';
import convert from 'htmr';
import { elementMap } from '../components/Prose';
import styled from "react-emotion";
import Imgix from 'react-imgix';

const Headline = styled.h1`
    font-size: 2em;
    margin: 0;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(30, 30, 30, 0.3);
    padding-bottom: 1rem;
`;

const FeaturedImageContainer = styled(Imgix)`
  height: 40vh;
  min-height: 200px;
  display: flex;
  
  & .Container {
    margin-top: auto;
  }
`;

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

function Article(props: IProps) {
  const { data: { article, loading } } = props;
  console.log(props);
  if (loading) {
    return (
      <div>
        loading
      </div>
    );
  }
  return (
    <div>
      <Helmet>
        <title>{article.title}</title>
      </Helmet>
      <div>
        <article className="Article">
          <Header>
            <FeaturedImageContainer type="bg" src={`https://urf.imgix.net/${article.featuredImage.resource}`}>
              <div className="Container">
                <Headline>{article.title}</Headline>
              </div>
            </FeaturedImageContainer>
            <div className="Container">
              <Byline>
                By{' '}
                {article.authors.map((author: any) => (
                  <span>{author.name ? author.name : author.username}</span>
                ))}, published{' '}
                {formatDistance(new Date(), new Date(article.publishedAt))} ago
              </Byline>
            </div>
          </Header>
          <div className="Container">
            <Content className="Prose">
              {convert(article.bodyHtml, elementMap)}
            </Content>
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
