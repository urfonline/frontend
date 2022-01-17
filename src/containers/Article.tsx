import React from 'react';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet';
import convert from 'htmr';
import dayjs from 'dayjs';
import { elementMap } from '../components/Prose';
import styled from '@emotion/styled';
import { ImageHeader } from '../components/ImageHeader';
import Spinner from '../components/Spinner';
import { useQuery } from 'react-apollo-hooks';

const Content = styled.div`
  font-weight: 400;
  max-width: 660px;
  line-height: 1.4;
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

const ArticleQuery = gql`
  query Article($articleId: String) {
    article(articleId: $articleId) {
      title
      slug
      publishedAt
      authors {
        id
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

interface IProps {}

const Article: React.FC<IProps> = (props) => {
  const { data, loading } = useQuery(ArticleQuery, {
    variables: {
      articleId: (props as any).match.params.articleId, //todo
    },
  });

  if (loading || !data) {
    return <Spinner />;
  }

  const article = data.article;
  return (
    <div>
      <Helmet title={article.title} />
      <div>
        <article className="Article">
          <Header>
            <ImageHeader title={article.title} image={article.featuredImage} />
            <div className="Container">
              <Byline>
                By{' '}
                {article.authors.map((author: any) => (
                  <span key={author.id}>{author.name ? author.name : author.username}</span>
                ))}
                , published{' '}
                {dayjs(article.publishedAt).fromNow()}
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
};

export default Article;
