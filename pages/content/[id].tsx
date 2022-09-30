import { GetStaticProps, NextPage } from "next";
import { PreviewContext, PreviewProps } from "../../components/previewContext";

import Head from "next/head";
import React, { ReactElement, useState } from "react";
import { createApolloClient } from "../../utility/GraphQLApolloClient";
import { gql } from "@apollo/client";
import { logViewEvent } from "../../utility/CdpService";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ReactPlayer from "react-player";

const FILE_DOMAIN_URL = process.env.FILE_DOMAIN_URL || "";

export interface SevensItem extends PreviewProps {
  sitecoreSeven_Id: string;
  sitecoreSeven_Createdon: Date;
  sitecoreSeven_Title: string;
  sitecoreSeven_Summary: string;
  assetFileName: string;
  assetId: string;
  relativeUrl: string;
  versionHash: string;
}

export interface SevensProps extends PreviewProps {
  sevensList: Array<SevensItem>;
}

//Get Homepage Content From Sevens - Everything without Null Title
const GET_ALL_CONTENT = gql`
  {
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

const GET_CURRENT_CONTENT = gql`
  {
    allM_Content_SitecoreSeven(where: { id_eq: "fFqa3btJyEagFaX8g_wdgg" }) {
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

const Content: NextPage<SevensProps> = (props): ReactElement<any> => {
  const router = useRouter();
  if (router.isFallback) {
    return <div><CircularProgress color="secondary" /></div>;
  }

  const[sevensItem, setSevensItem] = useState(props.sevensList)
  const { id } = router.query;
  logViewEvent({ page: "landing page", content_hub_id: id });
  const logView = (id, eventType) => {
    logViewEvent({ type: eventType, content_hub_id: id });   };


  return (
    <PreviewContext.Provider value={props}>
      <div className={styles.container}>
        <Head>
          <title></title>
          <meta
            name="description"
            content="A place to find relevant Sitecore content in 7 minute chunks."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

     <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Content
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {sevensItem[0].sitecoreSeven_Title}
        </Typography>
      </Breadcrumbs>
    </div>
    <main className={styles.main}>
    <h1 className={styles.title}>
       {sevensItem[0].sitecoreSeven_Title}
      </h1>
      {console.log(sevensItem[0])}
      <ReactPlayer
                  url={
                    FILE_DOMAIN_URL +
                    "/" +
                    sevensItem[0].relativeUrl +
                    "?" +
                    sevensItem[0].versionHash
                  }
                  onStart={() =>
                    logView(sevensItem[0].sitecoreSeven_Id, "VIDEO_STARTED")
                  }
                  onPlay={() =>
                    logView(sevensItem[0].sitecoreSeven_Id, "VIDEO_PLAYED")
                  }
                  onPause={() =>
                    logView(sevensItem[0].sitecoreSeven_Id, "VIDEO_PAUSED")
                  }
                  onEnded={() =>
                    logView(sevensItem[0].sitecoreSeven_Id, "VIDEO_ENDED")
                  }
                  controls
                  width={"100%"}
                ></ReactPlayer>
                <p>{sevensItem[0].sitecoreSeven_Summary}</p>
      </main>
     </div>
    </PreviewContext.Provider>
  );
};

export async function getStaticPaths() {
  const myclient = await createApolloClient(false).getClient();
  const { data } = await myclient.query({
    query: GET_ALL_CONTENT
  });
  const theSevens = data?.allM_Content_SitecoreSeven.results;
  const paths = theSevens.map((content) => ({
    params: { id: content.id }
  }));
  return {
    paths,
    fallback: true
  };
}

export const getStaticProps: GetStaticProps<SevensProps> = async (context) => {
  const myclient = createApolloClient(false).getClient();
  const { data } = await myclient.query({ query: GET_CURRENT_CONTENT });
  try {
    const sitecore_seven_item = data?.allM_Content_SitecoreSeven.results;
    return {
      props: {
        sevensList: sitecore_seven_item,
        preview: context.preview ?? false
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        sevensList: {},
        preview: context.preview ?? false
      }
    };
  }
};

export default Content;
