import { IconButton, Switch, Snackbar, CardHeader } from '@mui/material'
import Header from '../components/header'
import React, { useState } from 'react'
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
import { callFlows } from '../utility/BoxeverService'
import { logViewEvent, identifyVisitor } from '../utility/CdpService'
import styles from '../styles/Home.module.css'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useSession } from "next-auth/react";
import { Seven } from "../interfaces/seven";
import { SlotsList } from "../interfaces/slot";
import { getAllSevens } from './api/queries/getContent';

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

const logEvent = (id, eventType) => {
  logViewEvent({ type: eventType, ext: { contentHubID: id } })
}

export default function Home({ sevens }: { sevens: Seven[] }) {

  logViewEvent({ page: 'homepage' })
  const { data: session, status } = useSession()
  if (status === "authenticated" && session.user?.email) {
    identifyVisitor(session.user.email)
  }
  
  const [slotsList, setSlotsList] = useState({
    slot1: { contentID: sevens[0].id, contentIDsList: [], name: " " },
    slot2: { contentID: sevens[1].id, contentIDsList: [], name: " " },
    slot3: { contentID: sevens[2].id, contentIDsList: [], name: " " },
  })

  const [openShare, setOpenShare] = useState(false)
  const handleShareClick = () => {
    setOpenShare(true)
  }
  const handleHeartClick = (id) => {
    logEvent(id, 'CONTENT_HEARTED')
  }
  const handlePreviousClick = (number, slot) => {
    if (slot.contentIDsList?.length) {
      var index = slot.contentIDsList.indexOf(slot.contentID)
      if (index == 0) { { index = slot.contentIDsList.length } }
      var slots = slotsList
      slots[number] = { contentID: slot.contentIDsList[index - 1], contentIDsList: slot.contentIDsList, decisionDescription: slot.decisionDescription, name: slot.name }
      setSlotsList({ ...slots });
    }
  }

  const handleNextClick = (number, slot) => {
    if (slot.contentIDsList?.length) {
      var index = slot.contentIDsList.indexOf(slot.contentID)
      if (index == slot.contentIDsList.length - 1) { { index = -1 } }
      var slots = slotsList
      slots[number] = { contentID: slot.contentIDsList[index + 1], contentIDsList: slot.contentIDsList, decisionDescription: slot.decisionDescription, name: slot.name }
      setSlotsList({ ...slots });
    }
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const [openPersonalize, setOpenPersonalize] = useState(false)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [modalData, setModalData] = useState({
    id: '',
    title: '',
    description: '',
    media: ''
  })

  const getSeven = (id): Seven => {
    var seven = sevens?.find((x) => x.id === id)
    if (seven) {
      return seven
    }
    return sevens[0]
  }

  const icon = [<PersonIcon key="person" fontSize="large" />, <GroupsIcon key="group" fontSize="large" />, <ElectricBoltIcon key="bolt" fontSize="large" />]

  const [checked, setChecked] = React.useState(false)
  const handlePersonalize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)

    if (!checked) {
      console.log('Fetching real-time data from Sitecore personalize!')
      setOpenPersonalize(true)
      //Get Content from Sitecore Personalize
      callFlows({ friendlyId: 'my_three_7s' })
        .then((response) => {
          console.log(response)
          var slots = response as SlotsList
          setSlotsList({
            ...slotsList,
            slot1: slots.slot1,
            slot2: slots.slot2,
            slot3: slots.slot3,
          })
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      // Back to defaults
      console.log('Sitecore Personlize Disabled! Sorted by created date')
      setSlotsList({
        ...slotsList,
        slot1: { contentID: sevens[0].id, contentIDsList: [], name: " " },
        slot2: { contentID: sevens[1].id, contentIDsList: [], name: " " },
        slot3: { contentID: sevens[2].id, contentIDsList: [], name: " " },
      })
    }
  }
  return (
    <>
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
              message="Sitecore Personalize is now suggesting content"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            />
          </div>

          <div className={styles.grid}>
            {Object.keys(slotsList).map((item, i) => (
              <Card
                key={i}
                className={styles.card}>
                <CardHeader
                  avatar={icon[i]}
                  title={getSeven(
                    slotsList[item].contentID,
                  ).title.replace(/&nbsp;/g, '')}
                  subheader={slotsList[item].name}
                  onClick={() => {
                    handleOpen()
                    logEvent(
                      getSeven(slotsList[item].contentID).id,
                      'CONTENT_VIEWED',
                    )
                    setModalData(getSeven(slotsList[item].contentID))
                  }}
                />

                <CardMedia
                  className={styles.media}
                  component="video"
                  preload="metadata"
                  poster="/loading.gif"
                  src={getSeven(slotsList[item].contentID).media + '#t=12'}
                  onClick={() => {
                    handleOpen()
                    logEvent(
                      slotsList[item].contentID,
                      'CONTENT_VIEWED',
                    )
                    setModalData(getSeven(slotsList[item].contentID))
                  }}
                >
                </CardMedia>
                <CardContent>
                  {Object.keys(slotsList[item].contentIDsList).length > 0 ? <ArrowBackIosNewIcon onClick={() => {
                    handlePreviousClick(item, slotsList[item])
                  }} />: null}
                  {Object.keys(slotsList[item].contentIDsList).length > 0 ?<ArrowForwardIosIcon onClick={() => {
                    handleNextClick(item, slotsList[item])
                  }}
                    style={{ float: 'right' }} />:null}
                </CardContent>
                <CardActions style={{ width: '100%' }} >
                  <IconButton
                    style={{ float: 'right' }}
                    aria-label="add to favorites"
                    onClick={() => {
                      handleHeartClick(
                        getSeven(slotsList[item].contentID).id,
                      )
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="share"
                    onClick={() => {
                      handleShareClick()
                      navigator.clipboard.writeText("https://sitecore7s.vercel.app/content/" + slotsList[item].contentID)
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
                  {slotsList[item].decisionDescription ?
                    <HtmlTooltip
                      title={<React.Fragment>
                        <Typography color="inherit">{slotsList[item].name}</Typography>
                       {slotsList[item].decisionDescription}
                      </React.Fragment>
                      }
                    >
                      <IconButton><InfoIcon /></IconButton>
                    </HtmlTooltip>: null}
             
                </CardActions>
                <div>
                </div>
              </Card>
            ))}

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby={modalData.title}
              aria-describedby={modalData.description}
            >
              <Box sx={style}>
                <ReactPlayer
                  url={modalData.media}
                  onStart={() =>
                    logEvent(modalData.id, 'VIDEO_STARTED')
                  }
                  onPlay={() =>
                    logEvent(modalData.id, 'VIDEO_PLAYED')
                  }
                  onPause={() =>
                    logEvent(modalData.id, 'VIDEO_PAUSED')
                  }
                  onEnded={() =>
                    logEvent(modalData.id, 'VIDEO_ENDED')
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
                      navigator.clipboard.writeText("https://sitecore7s.vercel.app/content/" + modalData.id)
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                  <br /> {modalData.description}
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
    </>
  )
}


export const getStaticProps = async () => {
  const sevens = await getAllSevens();

  if (!sevens) {
    return {
      notFound: true,
      revalidate: 5,
    };
  }

  return {
    props: {
      sevens,
    },
    revalidate: 5,
  };
};

