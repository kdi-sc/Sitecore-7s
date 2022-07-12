import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { PreviewContext, PreviewProps } from "../../components/previewContext";
import { gql } from '@apollo/client';
import { GetStaticProps, NextPage } from 'next';
import { createApolloClient } from '../../utility/GraphQLApolloClient';
import { ReactElement } from 'react';
export interface SevensItem extends PreviewProps{
    sitecoreSeven_Id: string;
    sitecoreSeven_Title: string;
    sitecoreSeven_Summary: string;
    assetFileName: string;
    assetId: string;
  }
  
  export interface SevensProps extends PreviewProps{
    sevensList: Array<SevensItem>;
  }

//Get Homepage Content From Sevens - Everything without Null Title
const GET_ALL_CONTENT = gql`{
    allM_Content_SitecoreSeven(where: { sitecoreSeven_Title_neq: null }) {
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

  const GET_CURRENT_CONTENT = gql`{
    allM_Content_SitecoreSeven(where: { id_eq:"fFqa3btJyEagFaX8g_wdgg" }) {
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
    
const Content : NextPage<SevensProps> = (props): ReactElement<any> => {
    const { sevensList } = props;
    const router = useRouter()
    if (router.isFallback) {
        return <div>loading...</div>
     }
    const { id } = router.query
  return (
 <PreviewContext.Provider value={props}>
  <div className={styles.container}>

      <Head>
        <title>{sevensList[0].sitecoreSeven_Title}</title>
        <meta name="description" content="A place to find relevant Sitecore content in 7 minute chunks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {sevensList[0].sitecoreSeven_Title}
  <p>Content: {id}</p>

  </div>
  </PreviewContext.Provider>

  )
}

export async function getStaticPaths() {
    const myclient = await createApolloClient(false).getClient();
    const { data } = await myclient.query({ 
        query: GET_ALL_CONTENT });
        const theSevens = data?.allM_Content_SitecoreSeven.results
        const paths = theSevens.map(content => 
              ({ 
                params: { id: content.id }    
              })         
       );   
    return {
      paths,
      fallback: true,
    }
  }

  export const getStaticProps: GetStaticProps<SevensProps> = async (context) => {

    const myclient = await createApolloClient(false).getClient();
  
    const { data } = await myclient.query({ query: GET_CURRENT_CONTENT });
    try {
  
        const sitecore_seven_item = data?.allM_Content_SitecoreSeven.results
        console.log(sitecore_seven_item)
        return {
            props: {
              sevensList: sitecore_seven_item,
                preview: context.preview ?? false,
            }
  
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                sevensList: {},
                preview: context.preview ?? false,
            },
        };
    }
  };


export default Content
