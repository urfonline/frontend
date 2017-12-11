const promisify = require('util').promisify;
const fse = require('fs-extra');
const path = require('path');
const createApolloFetch = require('apollo-fetch').createApolloFetch;
const assetsManifest = require(path.join(__dirname, '../webpack-assets.json'));

function buildPage(title, meta) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${assetsManifest.main.css}" rel="stylesheet">
    <title>${title}</title>
    ${meta}
  </head>
  <body class="Core">
    <div class="js__app"></div>
    <script type="text/javascript" src="${assetsManifest.vendor.js}"></script>  
    <script type="text/javascript" src="${assetsManifest.main.js}"></script>  
  </body>  
</html>
  `;
}

async function savePage(urlPath, html) {
  await fse.outputFile(path.join(__dirname, `../dist/${urlPath}/index.html`), html);
}

function standardTitle(title) {
  return `${title} | URF`
}

const apolloFetch = createApolloFetch({
  uri: 'https://api.urfonline.com/graphql'
});

const buildSimplePage = (title, description, image) => buildPage(standardTitle(title), `
      <meta property="og:description" content="${description}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image" content="https://urf.imgix.net/${image}?w=1200&height=630&crop=faces&fit=crop" />
`);

async function generate() {
  const { data } = await apolloFetch({
    query: `
query StaticSiteRenderer {
  staticSitePayload {
    shows {
      shortDescription
      slug
      cover {
        resource
      }
      name
    }
    events {
      eventId
      title
      shortDescription
      slug
      featuredImage {
        resource
      }
    }
    articles {
      articleId
      title
      shortDescription
      slug
      featuredImage {
        resource
      }
    }
  }
}   
  `
  });

  const resources = data.staticSitePayload;

  await Promise.all(resources.shows.map(show => savePage(`shows/${show.slug}`,
    buildPage(standardTitle(show.name), `
      <meta property="og:description" content="${show.shortDescription}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image" content="https://urf.imgix.net/${show.cover.resource}?w=1200&height=630&crop=faces&fit=crop" />
    `)
  )));

  await Promise.all(resources.articles.map(article => savePage(`article/${article.slug}-${article.articleId}`,
    buildPage(standardTitle(article.title), `
      <meta property="og:description" content="${article.shortDescription}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image" content="https://urf.imgix.net/${article.featuredImage.resource}?w=1200&height=630&crop=faces&fit=crop" />
    `)
  )));

  await Promise.all(resources.events.map(event => savePage(`event/${event.slug}-${event.eventId}`,
    buildPage(standardTitle(event.title), `
      <meta property="og:description" content="${event.shortDescription}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image" content="https://urf.imgix.net/${event.featuredImage.resource}?w=1200&height=630&crop=faces&fit=crop" />
    `)
  )));


  await savePage('', buildSimplePage(
    'University Radio Falmer',
    'Student radio at the University of Sussex, broadcasting online and on DAB across Brighton',
    'original_images/facebook_image_1.jpg'
  ));

  await savePage('schedule', buildSimplePage(
    standardTitle('Schedule'),
    'Broadcasting 7 days a week, see what is on URF',
    'original_images/facebook_image_1.jpg'
  ));

  await savePage('news-events', buildSimplePage(
    standardTitle('News & Events'),
    'Student radio at the University of Sussex, broadcasting online and on DAB across Brighton',
    'original_images/facebook_image_1.jpg'
  ));
}

generate();
