import { gql } from '@apollo/client'
import { createApolloClient } from '../utility/GraphQLApolloClient'


const GET_ALL_CONTENT = gql`
  {
    allM_Content_SitecoreSeven(where: { sitecoreSeven_Title_neq: null }) {
      total
      results {
        id
        createdOn
        sitecoreSeven_Title
        sitecoreSeven_Summary
        sitecoreSeven_image
        cmpContentToLinkedAsset {
          total
          results {
            id
            fileName
            assetToPublicLink {
              results {
                resourceType
                fileKey
                relativeUrl
                versionHash
                resource
              }
            }
          }
        }
      }
    }
  }
`

function generateSiteMap(theSevens) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://sitecore7s.vercel.app</loc>
     </url>
     ${theSevens
       .map(({ id }) => {
         return `
       <url>
           <loc>${`https://sitecore7s.vercel.app/content/${id}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // make an API call to gather the URLs for our site
  const myclient = createApolloClient(false).getClient()
  const { data } = await myclient.query({ query: GET_ALL_CONTENT })
  const theSevens = data?.allM_Content_SitecoreSeven.results

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(theSevens);

  res.setHeader('Content-Type', 'text/xml');
  // send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
