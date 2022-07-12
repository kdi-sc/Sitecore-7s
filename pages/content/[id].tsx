import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'


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
