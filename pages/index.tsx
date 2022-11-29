import { GetStaticProps, NextPage } from 'next'
import { IconButton, Switch, Snackbar, CardHeader } from '@mui/material'
import { PreviewContext, PreviewProps } from '../components/previewContext'
import Header from '../components/header'
import React, { ReactElement, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GroupsIcon from '@mui/icons-material/Groups'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import PersonIcon from '@mui/icons-material/Person'
import ShareIcon from '@mui/icons-material/Share'
import Head from 'next/head'
import Image from 'next/image'
import Modal from '@mui/material/Modal'
import ReactPlayer from 'react-player'
import Typography from '@mui/material/Typography'
import { createApolloClient } from '../utility/GraphQLApolloClient'
import { callFlows } from '../utility/BoxeverService'
import { gql } from '@apollo/client'
import { logViewEvent } from '../utility/CdpService'
import styles from '../styles/Home.module.css'
import Fade from '@mui/material/Fade'

const FILE_DOMAIN_URL = process.env.FILE_DOMAIN_URL || ''

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  width: '80%',
  p: 4,
}

export interface SevensItem {
  sitecoreSeven_Id: string
  sitecoreSeven_CreatedOn: Date
  sitecoreSeven_Title: string
  sitecoreSeven_Summary: string
  sitecoreSeven_Image: string
  assetFileName: string
  assetId: string
  relativeUrl: string
  versionHash: string
}

export interface SevensProps extends PreviewProps {
  sevensList: Array<SevensItem>
}

export interface SlotsList {
  slot1: Slot
  slot2: Slot
  slot3: Slot
}

export interface Slot {
  contentID: string
  decisionName: string
  decisionDescription: string
}

//Get Homepage Content From Sevens - Everything without Null Title
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

const logEvent = (id, eventType) => {
  logViewEvent({ type: eventType, ext: { contentHubID: id } })
}

const Home: NextPage<SevensProps> = (props): ReactElement<any> => {
  logViewEvent({ page: 'homepage' })
  const [sevensList, setSevensList] = useState(props.sevensList)
  const [slotsList, setSlotsList] = useState({
    slot1: { contentID: props.sevensList[0].sitecoreSeven_Id },
    slot2: { contentID: props.sevensList[1].sitecoreSeven_Id },
    slot3: { contentID: props.sevensList[2].sitecoreSeven_Id },
  })

  const [openShare, setOpenShare] = useState(false)
  const handleShareClick = () => {
    setOpenShare(true)
  }
  const handleHeartClick = (id) => {
    logEvent(id, 'CONTENT_HEARTED')
  }
  const [openPersonalize, setOpenPersonalize] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [modalData, setModalData] = useState({
    sitecoreSeven_Id: '',
    sitecoreSeven_CreatedOn: new Date(),
    sitecoreSeven_Title: '',
    sitecoreSeven_Summary: '',
    sitecoreSeven_Image: '',
    relativeUrl: '',
    versionHash: '',
  })

  const getSeven = (id): SevensItem => {
    var seven = sevensList?.find((x) => x.sitecoreSeven_Id === id)
    if (seven) {
      return seven
    }
    return sevensList[0]
  }

  const [checked, setChecked] = React.useState(false)
  const handlePersonalize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)

    if (!checked) {
      console.log('Fetching real-time data from Sitecore personalize!')
      setOpenPersonalize(true)
      //Get Content from Sitecore Personalize
      callFlows({ friendlyId: 'my_three_7s' })
        .then((response) => {
          var slots = response as SlotsList
          console.log(slots)
          setSlotsList({
            ...slotsList,
            slot1: slots.slot1,
            slot2: slots.slot2,
            slot3: slots.slot3,
          })

          // var sortOrder = [slots.slot1.contentID, slots.slot2.contentID, slots.slot3.contentID];
          // let sortedSevens = [...sevensList];
          // setSevensList(sevensList.sort(function (a, b) {
          //   return (
          //     sortOrder.indexOf(b.sitecoreSeven_Id) -
          //     sortOrder.indexOf(a.sitecoreSeven_Id)
          //   );
          // }));
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      // Back to defaults
      console.log('Sitecore Personlize Disabled! Sorted by created date')
      // Sort in Ascending order based on the created date.

      // sevensList.sort((a: SevensItem, b: SevensItem) => {
      //   return b.sitecoreSeven_CreatedOn > a.sitecoreSeven_CreatedOn ? 1 : -1;
      //  });
      setSlotsList({
        ...slotsList,
        slot1: { contentID: sevensList[0].sitecoreSeven_Id },
        slot2: { contentID: sevensList[1].sitecoreSeven_Id },
        slot3: { contentID: sevensList[2].sitecoreSeven_Id },
      })
    }
  }

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
              onChange={handlePersonalize}
              inputProps={{ 'aria-label': 'Personalize' }}
            />
            <Snackbar
              open={openPersonalize}
              onClose={() => setOpenPersonalize(false)}
              autoHideDuration={4200}
              message="Content is being personalized based on what you have viewed"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            />
          </div>
          <div className={styles.grid}>
            {/* **
            
            ***Individual Content***
            
            *** */}
            <Fade in={checked || !checked} style={{ transitionDelay: '600ms'}}>  
            <Card
              key={getSeven(slotsList.slot1.contentID).sitecoreSeven_Id}
              className={styles.card}
            >
              <CardHeader
                avatar={<PersonIcon fontSize="large" />}
                title={getSeven(
                  slotsList.slot1.contentID,
                ).sitecoreSeven_Title.replace(/&nbsp;/g, '')}
                subheader="For You"
                onClick={() => {
                  handleOpen()
                  logEvent(
                    getSeven(slotsList.slot1.contentID).sitecoreSeven_Id,
                    'CONTENT_VIEWED',
                  )
                  setModalData(getSeven(slotsList.slot1.contentID))
                }}
              />

              <CardMedia
                component="video"
                preload="metadata"
                src={
                  FILE_DOMAIN_URL +
                  '/' +
                  getSeven(slotsList.slot1.contentID).relativeUrl +
                  '?' +
                  getSeven(slotsList.slot1.contentID).versionHash +
                  '#t=42'
                }
                onClick={() => {
                  handleOpen()
                  logEvent(
                    getSeven(slotsList.slot1.contentID).sitecoreSeven_Id,
                    'CONTENT_VIEWED',
                  )
                  setModalData(getSeven(slotsList.slot1.contentID))
                }}
              ></CardMedia>
              <CardContent
                onClick={() => {
                  handleOpen()
                  logEvent(
                    getSeven(slotsList.slot1.contentID).sitecoreSeven_Id,
                    'CONTENT_VIEWED',
                  )
                  setModalData(getSeven(slotsList.slot1.contentID))
                }}
              ></CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => {
                    handleHeartClick(
                      getSeven(slotsList.slot1.contentID).sitecoreSeven_Id,
                    )
                  }}
                >
                 
                
                
                 <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() => {
                    handleShareClick()
                    navigator.clipboard.writeText("https://sitecore7s.vercel.app/content/" + slotsList.slot1.contentID)
                  }}
                >
                  <ShareIcon />
                  <Snackbar
                    open={openShare}
                    onClose={() => setOpenShare(false)}
                    autoHideDuration={2000}
                    message="Share link copied to clipboard"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  />
                </IconButton>
                {/* <Link href={"/content/" + slotsList.slot1.contentID}><small>Link</small></Link> */}
              </CardActions>
              
            </Card>
            </Fade>

            {/* *****Trending Content****** */}
            <Fade in={checked || !checked} style={{ transitionDelay: '600ms'}}>  
            <Card key={slotsList.slot2.contentID} className={styles.card}>
              <CardHeader
                avatar={<GroupsIcon fontSize="large" />}
                title={getSeven(
                  slotsList.slot2.contentID,
                ).sitecoreSeven_Title.replace(/&nbsp;/g, '')}
                subheader="Trending"
                onClick={() => {
                  handleOpen()
                  logEvent(slotsList.slot2.contentID, 'CONTENT_VIEWED')
                  setModalData(getSeven(slotsList.slot2.contentID))
                }}
              />

              <CardMedia
                component="video"
                preload="metadata"
                src={
                  FILE_DOMAIN_URL +
                  '/' +
                  getSeven(slotsList.slot2.contentID).relativeUrl +
                  '?' +
                  getSeven(slotsList.slot2.contentID).versionHash +
                  '#t=42'
                }
                onClick={() => {
                  handleOpen()
                  logEvent(slotsList.slot2.contentID, 'CONTENT_VIEWED')
                  setModalData(getSeven(slotsList.slot2.contentID))
                }}
              ></CardMedia>
              <CardContent
                onClick={() => {
                  handleOpen()
                  logEvent(slotsList.slot2.contentID, 'CONTENT_VIEWED')
                  setModalData(getSeven(slotsList.slot2.contentID))
                }}
              ></CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => {
                    handleHeartClick(slotsList.slot2.contentID)
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() => {
                    handleShareClick()
                    navigator.clipboard.writeText("https://sitecore7s.vercel.app/content/" + slotsList.slot2.contentID )
                  }}
                >
                  <ShareIcon />
                  <Snackbar
                    open={openShare}
                    onClose={() => setOpenShare(false)}
                    autoHideDuration={2000}
                    message="Share link copied to clipboard"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  />
                </IconButton>
                {/* <Link href={"/content/" + slotsList.slot2.contentID}><small>Link</small></Link> */}

              </CardActions>
            </Card>
            </Fade>

            {/* *****Brand Boosted Content****** */}
            <Fade in={checked || !checked} style={{ transitionDelay: '600ms'}}>  
            <Card key={slotsList.slot3.contentID} className={styles.card}>
              <CardHeader
                avatar={<ElectricBoltIcon fontSize="large" />}
                title={getSeven(
                  slotsList.slot3.contentID,
                ).sitecoreSeven_Title.replace(/&nbsp;/g, '')}
                subheader="Boosted"
                onClick={() => {
                  handleOpen()
                  logEvent(
                    getSeven(slotsList.slot3.contentID).sitecoreSeven_Id,
                    'CONTENT_VIEWED',
                  )
                  setModalData(getSeven(slotsList.slot3.contentID))
                }}
              />
              <CardMedia
                component="video"
                preload="metadata"
                src={
                  FILE_DOMAIN_URL +
                  '/' +
                  getSeven(slotsList.slot3.contentID).relativeUrl +
                  '?' +
                  getSeven(slotsList.slot3.contentID).versionHash +
                  '#t=42'
                }
                onClick={() => {
                  handleOpen()
                  logEvent(
                    getSeven(slotsList.slot3.contentID).sitecoreSeven_Id,
                    'CONTENT_VIEWED',
                  )
                  setModalData(getSeven(slotsList.slot3.contentID))
                }}
              ></CardMedia>
              <CardContent
                onClick={() => {
                  handleOpen()
                  logEvent(slotsList.slot3.contentID, 'CONTENT_VIEWED')
                  setModalData(getSeven(slotsList.slot3.contentID))
                }}
              ></CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => {
                    handleHeartClick(slotsList.slot3.contentID)
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() => {
                    handleShareClick()
                    navigator.clipboard.writeText("https://sitecore7s.vercel.app/content/" + slotsList.slot3.contentID )
                  }}
                >
                  <ShareIcon />
                  <Snackbar
                    open={openShare}
                    onClose={() => setOpenShare(false)}
                    autoHideDuration={2000}
                    message="Share link copied to clipboard"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
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
                    '/' +
                    modalData.relativeUrl +
                    '?' +
                    modalData.versionHash
                  }
                  onStart={() =>
                    logEvent(modalData.sitecoreSeven_Id, 'VIDEO_STARTED')
                  }
                  onPlay={() =>
                    logEvent(modalData.sitecoreSeven_Id, 'VIDEO_PLAYED')
                  }
                  onPause={() =>
                    logEvent(modalData.sitecoreSeven_Id, 'VIDEO_PAUSED')
                  }
                  onEnded={() =>
                    logEvent(modalData.sitecoreSeven_Id, 'VIDEO_ENDED')
                  }
                  controls
                  width={'100%'}
                ></ReactPlayer>

                <Typography color="text.secondary">
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="share"
                    onClick={() => {
                      handleShareClick()
                      navigator.clipboard.writeText(
                        FILE_DOMAIN_URL +
                        '/' +
                        modalData.relativeUrl +
                        '?' +
                        modalData.versionHash,
                      )
                    }}
                  >
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
            Powered by{' '}
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
  )
}

export const getStaticProps: GetStaticProps<SevensProps> = async (context) => {
  const myclient = createApolloClient(false).getClient()
  const { data } = await myclient.query({ query: GET_ALL_CONTENT })
  try {
    /**
     *  Get all content list from content Hub
     */
    const theSevens = data?.allM_Content_SitecoreSeven.results
    const theSevensProps = theSevens.map((SevensItem) => {
      return {
        sitecoreSeven_Title: SevensItem.sitecoreSeven_Title,
        sitecoreSeven_Summary: SevensItem.sitecoreSeven_Summary,
        sitecoreSeven_Image: SevensItem.sitecoreSeven_Image
          ? SevensItem.sitecoreSeven_Image
          : '',
        sitecoreSeven_Id: SevensItem.id,
        sitecoreSeven_CreatedOn: SevensItem.createdOn,
        relativeUrl: SevensItem.cmpContentToLinkedAsset.results[0]
          .assetToPublicLink.results[0]
          ? SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].relativeUrl
          : '',
        versionHash: SevensItem.cmpContentToLinkedAsset.results[0]
          .assetToPublicLink.results[0]
          ? SevensItem.cmpContentToLinkedAsset.results[0].assetToPublicLink
            .results[0].versionHash
          : '',
      }
    })
    return {
      props: {
        sevensList: [...theSevensProps],
        preview: context.preview ?? false,
      },
      revalidate: 5,
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        sevensList: [],
        preview: context.preview ?? false,
      },
    }
  }
}

export default Home
