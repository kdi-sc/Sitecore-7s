import { GetStaticProps, NextPage } from "next";
import { IconButton, Switch, Snackbar, CardHeader } from "@mui/material";
import { PreviewContext, PreviewProps } from "../components/previewContext";
import Header from "../components/header"
import React, { ReactElement, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from '@mui/icons-material/Groups';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PersonIcon from '@mui/icons-material/Person';
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
  sitecoreSeven_Image:string;
  assetFileName: string;
  assetId: string;
  relativeUrl: string;
  versionHash: string;
}

export interface ContentViewed {
  content_viewed: Array<string>;
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
`;

const logEvent = (id, eventType) => {
 logViewEvent({ type: eventType, ext: {contentHubID: id} });   };


const Home: NextPage<SevensProps> = (props): ReactElement<any> => {
  logViewEvent({ page: "homepage" })
  const[sevensList, setSevensList] = useState(props.sevensList)
  const [openShare, setOpenShare] = useState(false);
  const handleShareClick = () => {
    setOpenShare(true)
  }
  const handleHeartClick = (id) => {
    logEvent(id, "CONTENT_HEARTED")
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
    sitecoreSeven_Image:"",
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

    callFlows({ friendlyId: "my_three_7s" })
    .then((response) => {
      var data = response as ContentViewed;
      var sortOrder = data.content_viewed;
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
    <Header />
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

             {/* *****Individual Content****** */}

             <Fade key={sevensList[0].sitecoreSeven_Id} in={checked || !checked} style={{ transitionDelay: '420ms'}}>   
              <Card
                key={sevensList[0].sitecoreSeven_Id}
                className={styles.card}>
                  <CardHeader 
                  avatar={<PersonIcon fontSize="large"/>}
                  title={sevensList[0].sitecoreSeven_Title.replace(/&nbsp;/g, "")}
                  subheader="For You"
                  />
                
                <CardMedia
                  component="video"
                  preload="metadata"
                  src={
                    FILE_DOMAIN_URL +
                    "/" +
                    sevensList[0].relativeUrl +
                    "?" +
                    sevensList[0].versionHash + "#t=42"
                  }
                  onClick={() => {
                    handleOpen();
                    logEvent(sevensList[0].sitecoreSeven_Id, "CONTENT_VIEWED");
                    setModalData(sevensList[0]);
                  }}
                ></CardMedia>
                <CardContent
                   onClick={() => {
                      handleOpen();
                      logEvent(sevensList[0].sitecoreSeven_Id, "CONTENT_VIEWED");
                      setModalData(sevensList[0]);
                            }}>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites"
                   onClick={() => {handleHeartClick(sevensList[0].sitecoreSeven_Id)}} >
                    <FavoriteIcon />
                  </IconButton>  
                  <IconButton aria-label="share"
                  onClick={() => {handleShareClick(); navigator.clipboard.writeText( FILE_DOMAIN_URL + "/" + sevensList[0].relativeUrl + "?" + sevensList[0].versionHash)}} >
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
              </Fade>

              {/* *****Trending Content****** */}

              <Fade key={sevensList[1].sitecoreSeven_Id} in={checked || !checked} style={{ transitionDelay: '420ms'}}>   
              <Card
                key={sevensList[1].sitecoreSeven_Id}
                className={styles.card}>
                  <CardHeader 
                  avatar={<GroupsIcon fontSize="large"/>}
                  title={sevensList[1].sitecoreSeven_Title.replace(/&nbsp;/g, "")}
                  subheader="Trending"
                  />
                
                <CardMedia
                  component="video"
                  preload="metadata"
                  src={
                    FILE_DOMAIN_URL +
                    "/" +
                    sevensList[1].relativeUrl +
                    "?" +
                    sevensList[1].versionHash + "#t=42"
                  }
                  onClick={() => {
                    handleOpen();
                    logEvent(sevensList[1].sitecoreSeven_Id, "CONTENT_VIEWED");
                    setModalData(sevensList[1]);
                  }}
                ></CardMedia>
                <CardContent
                   onClick={() => {
                      handleOpen();
                      logEvent(sevensList[1].sitecoreSeven_Id, "CONTENT_VIEWED");
                      setModalData(sevensList[1]);
                            }}>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites"
                   onClick={() => {handleHeartClick(sevensList[1].sitecoreSeven_Id)}} >
                    <FavoriteIcon />
                  </IconButton>  
                  <IconButton aria-label="share"
                  onClick={() => {handleShareClick(); navigator.clipboard.writeText( FILE_DOMAIN_URL + "/" + sevensList[1].relativeUrl + "?" + sevensList[1].versionHash)}} >
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
              </Fade>

               {/* *****Brand Boosted Content****** */}

               <Fade key={sevensList[2].sitecoreSeven_Id} in={checked || !checked} style={{ transitionDelay: '420ms'}}>   
              <Card
                key={sevensList[2].sitecoreSeven_Id}
                className={styles.card}>
                  <CardHeader 
                  avatar={<ElectricBoltIcon fontSize="large"/>}
                  title={sevensList[2].sitecoreSeven_Title.replace(/&nbsp;/g, "")}
                  subheader="Brand Boosted"
                  />
                <CardMedia
                  component="video"
                  preload="metadata"
                  src={
                    FILE_DOMAIN_URL +
                    "/" +
                    sevensList[2].relativeUrl +
                    "?" +
                    sevensList[2].versionHash + "#t=42"
                  }
                  onClick={() => {
                    handleOpen();
                    logEvent(sevensList[2].sitecoreSeven_Id, "CONTENT_VIEWED");
                    setModalData(sevensList[2]);
                  }}
                ></CardMedia>
                <CardContent
                   onClick={() => {
                      handleOpen();
                      logEvent(sevensList[2].sitecoreSeven_Id, "CONTENT_VIEWED");
                      setModalData(sevensList[2]);
                            }}>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites"
                   onClick={() => {handleHeartClick(sevensList[2].sitecoreSeven_Id)}} >
                    <FavoriteIcon />
                  </IconButton>  
                  <IconButton aria-label="share"
                  onClick={() => {handleShareClick(); navigator.clipboard.writeText( FILE_DOMAIN_URL + "/" + sevensList[2].relativeUrl + "?" + sevensList[2].versionHash)}} >
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
              </Fade>

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
                    logEvent(modalData.sitecoreSeven_Id, "VIDEO_STARTED")
                  }
                  onPlay={() =>
                    logEvent(modalData.sitecoreSeven_Id, "VIDEO_PLAYED")
                  }
                  onPause={() =>
                    logEvent(modalData.sitecoreSeven_Id, "VIDEO_PAUSED")
                  }
                  onEnded={() =>
                    logEvent(modalData.sitecoreSeven_Id, "VIDEO_ENDED")
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
  const myclient = createApolloClient(false).getClient();
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
        sitecoreSeven_Image: SevensItem.sitecoreSeven_Image ? SevensItem.sitecoreSeven_Image : "",
        sitecoreSeven_Id: SevensItem.id,
        sitecoreSeven_CreatedOn: SevensItem.createdOn,
        relativeUrl:
          SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0] ? SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].relativeUrl : "",
        versionHash:
          SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0] ? SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].versionHash : ""
      };
    });
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
