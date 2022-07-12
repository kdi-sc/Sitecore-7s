import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { PreviewContext, PreviewProps } from "../../components/previewContext";
import { gql } from '@apollo/client';
import { GetStaticProps } from 'next';
import { createApolloClient } from '../../utility/GraphQLApolloClient';
export interface SevensItem {
    sitecoreSeven_Id: string;
    sitecoreSeven_Title: string;
    sitecoreSeven_Summary: string;
    assetFileName: string;
    assetId: string;
  }
  
  export interface SevensProps extends PreviewProps{
    sevensList: Array<SevensItem>;
  }

    //get content from CH
    const GET_HP_CONTENT = gql`{
        allM_Content_SitecoreSeven(where: { id_eq: fFqa3btJyEagFaX8g_wdgg}) {
          results {
            id
            sitecoreSeven_Title
            sitecoreSeven_Summary
            cmpContentToLinkedAsset(first: 1) {
              results {
                fileName
                id
              }
            }
          }
        }
      }
      `;
    
const Content = () => {
    const router = useRouter()
    const { id } = router.query
  return (
  <div className={styles.container}>

      <Head>
        <title>Sitecore 7&apos;s</title>
        <meta name="description" content="A place to find relevant Sitecore content in 7 minute chunks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

  <p>Content: {id}</p>

  </div>
  )
}

export default Content
