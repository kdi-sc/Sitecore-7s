import { GetStaticProps, GetServerSideProps, NextPage } from "next";
import React, { ReactElement, useEffect, useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link'
import { PreviewContext, PreviewProps } from "../components/previewContext";

import { identifyVisitor,logViewEvent} from '../utility/CdpService';
import { createApolloClient } from "../utility/GraphQLApolloClient";
import { gql } from '@apollo/client';

const FILE_DOMAIN_URL = process.env.FILE_DOMAIN_URL || '';

export interface SevensItem {
  sitecoreSeven_Id: string;
  sitecoreSeven_Title: string;
  sitecoreSeven_Summary: string;
  assetFileName: string;
  assetId: string;
  relativeUrl: string;
  versionHash: string;
}

export interface SevensProps extends PreviewProps{
  sevensList: Array<SevensItem>;
}
//Get Homepage Content From Sevens - Everything without Null Title
const GET_HP_CONTENT = gql`{
  allM_Content_SitecoreSeven(where: { sitecoreSeven_Title_neq: null }) {
    total
    results {
      id
      sitecoreSeven_Title
      sitecoreSeven_Summary
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
`;


const Home: NextPage<SevensProps> = (props): ReactElement<any> => {
  const { sevensList } = props;
  logViewEvent();
  return (
    <PreviewContext.Provider value={props}>
      
    <div className={styles.container}>

      <Head>
        <title>Sitecore 7&apos;s</title>
        <meta name="description" content="A place to find relevant Sitecore content in 7 minute chunks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>

        <h1 className={styles.title}>
        Sitecore 7&apos;s
        </h1>
        <p className={styles.description}>
        A place to find relevant Sitecore content in 7 minute chunks
        </p>
        <div className={styles.grid}>

        {sevensList.slice(0, 3).map((sevensItem) => (
        <Link key={sevensItem.sitecoreSeven_Id} href={{
          pathname:"/content/" + sevensItem.sitecoreSeven_Id
        }}>
      <Card className={styles.card}>
      <CardMedia
        component="img"
        height="140"
        image="/testimg1.png"
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        {sevensItem.sitecoreSeven_Title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {sevensItem.sitecoreSeven_Summary.replace(/^(.{80}[^\s]*).*/, "$1")}...
        </Typography>
      </CardContent>
      <CardActions>    
      <Link href={FILE_DOMAIN_URL + "/" + sevensItem.relativeUrl+"?"+sevensItem.versionHash}>
      <Button size="small">View Now</Button>
      </Link>
         <Link href={{
          pathname:"/content/" + sevensItem.sitecoreSeven_Id
        }}>
      <Button size="small">Learn More</Button>
      </Link>
      </CardActions>
    </Card>
    </Link>
        ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://sitecore.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/logo.svg" alt="Sitecore Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
    </PreviewContext.Provider>
  )
}
logViewEvent();

// ****** 
export const getStaticProps: GetStaticProps<SevensProps> = async (context) => {

  const myclient = await createApolloClient(false).getClient();

  const { data } = await myclient.query({ query: GET_HP_CONTENT });
  try {

      const theSevens = data?.allM_Content_SitecoreSeven.results;
      const AssetUrls = data?.allM_Content_SitecoreSeven.results.sitecoreSeven_Title;



      const theSevensProps = theSevens.map((SevensItem) => {

              return {
                sitecoreSeven_Title: SevensItem.sitecoreSeven_Title,
                sitecoreSeven_Summary: SevensItem.sitecoreSeven_Summary,
                sitecoreSeven_Id: SevensItem.id,
                relativeUrl: SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink.results[0].relativeUrl,
                versionHash: SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink.results[0].versionHash
              };

      });

      return {
          props: {
            sevensList: [...theSevensProps],
              preview: context.preview ?? false,
          }

      };
  } catch (error) {
      console.log(error);
      return {
          props: {
            sevensList: [],
              preview: context.preview ?? false,
          },
      };
  }
};

//******


export default Home
