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
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans" rel="stylesheet">
    <link href="${assetsManifest.main.css}" rel="stylesheet">
    <title>${title} | URF</title>
    ${meta}
  </head>
  <body class="Core">
    <div class="js__app"></div>
    <script type="text/javascript" src="${assetsManifest.main.js}"></script>  
  </body>  
</html>
  `;
}

async function savePage(urlPath, html) {
  await fse.outputFile(path.join(__dirname, `../dist/${urlPath}/index.html`), html);
}

const apolloFetch = createApolloFetch({
  uri: 'https://api.urfonline.com/graphql'
});

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
      title
      featuredImage {
        resource
      }
    }
    articles {
      title
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
    buildPage(show.name, `
      <meta type="og:image" />
    `)
  )))

}

generate();
