import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { identifyVisitor,logViewEvent} from '../utility/CdpService';

const Home: NextPage = () => {

  logViewEvent();
  return (
    <div className={styles.container}>

      <Head>
        <title>Sitecore 7&apos;s</title>
        <meta name="description" content="A place to find relevant Sitecore content in 7 minute chunks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to Sitecore 7&apos;s!
        </h1>
        <p className={styles.description}>
        A place to find relevant Sitecore content in 7 minute chunks.
        </p>
        <div className={styles.grid}>
      <Card className={styles.card}>
      <CardMedia
        component="img"
        height="140"
        image="/testimg1.png"
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Test 1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a test of a Sitecore 7
        </Typography>
      </CardContent>
      <CardActions>
      <Button size="small">Learn More</Button>
      <Button size="small">Share</Button>
      </CardActions>
    </Card>



    <Card className={styles.card}>
      <CardMedia
        component="img"
        height="140"
        image="/testimg2.png"
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Test 2
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a test of a Sitecore 7
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>

    <Card className={styles.card}>
      <CardMedia
        component="img"
        height="140"
        image="/testimg3.png"
        alt=""
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Test 3
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a test of a Sitecore 7
        </Typography>
      </CardContent>
      <CardActions>
      <Button size="small">Learn More</Button>
      <Button size="small">Share</Button>
      </CardActions>
    </Card>
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
  )
}
logViewEvent();

export default Home
