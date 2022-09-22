import { GetStaticProps, NextPage } from "next";
import { IconButton, Switch, Snackbar } from "@mui/material";
import { PreviewContext, PreviewProps } from "../components/previewContext";
import React, { ReactElement, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Head from "next/head";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import ReactPlayer from "react-player";
import Typography from "@mui/material/Typography";
import { createApolloClient } from "../utility/GraphQLApolloClient";
import { callFlows } from "../utility/BoxeverService";
import { gql } from "@apollo/client";
import { logViewEvent } from "../utility/CdpService";
import styles from "../styles/Home.module.css";
import Grow from '@mui/material/Grow';
import Fade from '@mui/material/Fade';


const FILE_DOMAIN_URL = process.env.FILE_DOMAIN_URL || "";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  width: "80%",
  p: 4
};

export interface SevensItem {
  sitecoreSeven_Id: string;
  sitecoreSeven_CreatedOn: Date;
  sitecoreSeven_Title: string;
  sitecoreSeven_Summary: string;
  assetFileName: string;
  assetId: string;
  relativeUrl: string;
  versionHash: string;
}

export interface ContentWatched {
  content_watched: Array<string>;
  orderBy: string;
}

export interface SevensProps extends PreviewProps {
  sevensList: Array<SevensItem>;
}

//Get Homepage Content From Sevens - Everything without Null Title
const GET_HP_CONTENT = gql`
  {
    allM_Content_SitecoreSeven(where: { sitecoreSeven_Title_neq: null }) {
      total
      results {
        id
        createdOn
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

const logView = (id, eventType) => {
  logViewEvent({ type: eventType, content_hub_id: id });
};

const Home: NextPage<SevensProps> = (props): ReactElement<any> => {
  logViewEvent({ page: "homepage" })
  const[sevensList, setSevensList] = useState(props.sevensList)
  const [openShare, setOpenShare] = useState(false);
  const handleShareClick = () => {
    setOpenShare(true)
  }
  const [openPersonalize, setOpenPersonalize] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalData, setModalData] = useState({
    sitecoreSeven_Id: "",
    sitecoreSeven_CreatedOn: new Date(),
    sitecoreSeven_Title: "",
    sitecoreSeven_Summary: "",
    relativeUrl: "",
    versionHash: ""
  });

  const [checked, setChecked] = React.useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);


    if (!checked) {
      console.log("Sitecore Personlize Enabled!");
      setOpenPersonalize(true)
      // Get Watched Video List IDs from Sitecore Personlize
    
      /* For testing purpose only to manually sort some items.*/
      // sortOrder = ([
      //   "iYSfV35WMkyrUgnwRU3zGA",
      //   "fFqa3btJyEagFaX8g_wdgg",
      //   "irhQOl-aYEKfBhz4eHrAlg"
      // ]);

    callFlows({ friendlyId: "my_three_7s" })
    .then((response) => {
      var data = response as ContentWatched;
      var sortOrder = data.content_watched;
      console.log("Sort Order: ", sortOrder) 
      let sortedSevens = [...sevensList];
      setSevensList(sortedSevens.sort(function (a, b) {
        return (
          sortOrder.indexOf(a.sitecoreSeven_Id) -
          sortOrder.indexOf(b.sitecoreSeven_Id)
        );
      }));
    })
    .catch((e) => {
      console.log(e);
    });

    } else {
      // Back to default sort order
      // this is a temporary dummy fix unless we decide if we should group the list into watched, continue watching etc.
      console.log("Sitecore Personlize Disabled! Sorted by created date");
      // Sort in Ascending order based on the created date.
      sevensList.sort((a: SevensItem, b: SevensItem) => {
        return b.sitecoreSeven_CreatedOn > a.sitecoreSeven_CreatedOn ? 1 : -1;
      });
    }
  };

  return (
    <PreviewContext.Provider value={props}>
      <div className={styles.container}>
        <Head>
          <title>Sitecore 7&apos;s</title>
          <meta
            name="description"
            content="a place for small bites of Sitecore conversations."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            <Image src="/sitecore.png" alt="Sitecore" width={32} height={32} />
            Sitecore 7&apos;s
          </h1>
          <p className={styles.description}>
            A place for small bites of Sitecore conversations.
          </p>
          <div>
            Personalize
            <Switch
              value="Personalized"
              onChange={handleChange}
              inputProps={{ "aria-label": "Personalize" }}
            />
            <Snackbar
                 open={openPersonalize}
                 onClose={() => setOpenPersonalize(false)}
                 autoHideDuration={4200}
                 message="Content is being personalized based on what you have viewed"
                 anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'}}
                  />
          </div>
          <div className={styles.grid}>
            {sevensList.slice(0, 3).map((sevensItem) => (
              
              <Grow key={sevensItem.sitecoreSeven_Id} in={checked || !checked} style={{ transitionDelay: '200ms'}}>
              <Card
                key={sevensItem.sitecoreSeven_Id}
                className={styles.card}
              >
                <Fade in={checked || !checked} style={{ transitionDelay: '200ms'}}>
                <CardMedia
                  component="video"
                  preload="metadata"
                  height="100%"
                  src={
                    FILE_DOMAIN_URL +
                    "/" +
                    sevensItem.relativeUrl +
                    "?" +
                    sevensItem.versionHash + "#t=0.001"
                  }
                  onClick={() => {
                    handleOpen();
                    logView(sevensItem.sitecoreSeven_Id, "CONTENT_VIEWED");
                    setModalData(sevensItem);
                  }}
                ></CardMedia>
                </Fade>
                <CardContent
                   onClick={() => {
                      handleOpen();
                      logView(sevensItem.sitecoreSeven_Id, "CONTENT_VIEWED");
                      setModalData(sevensItem);
                            }}>
                  <Typography gutterBottom variant="body2" component="div">
                    <b>
                      {sevensItem.sitecoreSeven_Title.replace(/&nbsp;/g, "")}
                    </b>
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>  
                  <IconButton aria-label="share"
                  onClick={() => {handleShareClick(); navigator.clipboard.writeText( FILE_DOMAIN_URL + "/" + sevensItem.relativeUrl + "?" + sevensItem.versionHash)}} >
                  <ShareIcon />
                  <Snackbar
                 open={openShare}
                 onClose={() => setOpenShare(false)}
                 autoHideDuration={2000}
                 message="Share link copied to clipboard"
                 anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'}}
                  />
                 </IconButton>
                </CardActions>
              </Card>
              </Grow>
            ))}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby={modalData.sitecoreSeven_Title}
              aria-describedby={modalData.sitecoreSeven_Summary}
            >
              <Box sx={style}>
                <ReactPlayer
                  url={
                    FILE_DOMAIN_URL +
                    "/" +
                    modalData.relativeUrl +
                    "?" +
                    modalData.versionHash
                  }
                  onStart={() =>
                    logView(modalData.sitecoreSeven_Id, "VIDEO_STARTED")
                  }
                  onPlay={() =>
                    logView(modalData.sitecoreSeven_Id, "VIDEO_PLAYED")
                  }
                  onPause={() =>
                    logView(modalData.sitecoreSeven_Id, "VIDEO_PAUSED")
                  }
                  onEnded={() =>
                    logView(modalData.sitecoreSeven_Id, "VIDEO_ENDED")
                  }
                  controls
                  width={"100%"}
                ></ReactPlayer>
             
                <Typography color="text.secondary">
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share"
                  onClick={() => {handleShareClick(); navigator.clipboard.writeText( FILE_DOMAIN_URL + "/" + modalData.relativeUrl + "?" + modalData.versionHash)}} >
                  <ShareIcon />
                 </IconButton>
                  <br /> {modalData.sitecoreSeven_Summary}             
              
                </Typography>
              </Box>
            </Modal>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://sitecore.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/logo.png"
                alt="Sitecore Logo"
                width={90}
                height={20}
              />
            </span>
          </a>
        </footer>
      </div>
    </PreviewContext.Provider>
  );
};

// ******
export const getStaticProps: GetStaticProps<SevensProps> = async (context) => {
  const myclient = await createApolloClient(false).getClient();

  const { data } = await myclient.query({ query: GET_HP_CONTENT });
  try {
    /**
     *  Get all content list from content Hub
     */
    const theSevens = data?.allM_Content_SitecoreSeven.results;
    const theSevensProps = theSevens.map((SevensItem) => {
      return {
        sitecoreSeven_Title: SevensItem.sitecoreSeven_Title,
        sitecoreSeven_Summary: SevensItem.sitecoreSeven_Summary,
        sitecoreSeven_Id: SevensItem.id,
        sitecoreSeven_CreatedOn: SevensItem.createdOn,
        relativeUrl:
          SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].relativeUrl,
        versionHash:
          SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].versionHash
      };
    });

    /**
     * Get the list of watched videos from CDP based on the brwoserId.
     */

    return {
      props: {
        sevensList: [...theSevensProps],
        preview: context.preview ?? false
      },
      revalidate: 5
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        sevensList: [],
        preview: context.preview ?? false
      }
    };
  }
};

//******

export default Home;
