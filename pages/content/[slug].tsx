import { FC } from 'react';
import { getAllSevens, getSevenById } from '../api/queries/getContent';
import { slugify } from '../../utility/slugHelper';
import { logViewEvent } from '../../utility/CdpService'
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


export interface Params {
  id: string;
  slug: string;
}

export declare type SevenParams = {
  [param: string]: Params;
};

interface Props {
  seven: any;
}

const SevenDetail: FC<Props> = ({ seven }) => {

  if (!seven) {
    return (
      <div ><img src='/loading.gif' className={styles.loading}></img></div>
    );
  }

  logViewEvent({
    page: '7s detail page',
    id: seven.id,
    title: seven.title
  })

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>
            Sitecore 7s -{' '}
            {seven.title.replace(/&nbsp;/g, '')}
          </title>
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
              href="/">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {seven.title.replace(/&nbsp;/g, '')}
            </Typography>
          </Breadcrumbs>
        </div>

        <div>
          <h1 className={styles.title}>
            {seven.title.replace(/&nbsp;/g, '')}
          </h1>
          <div className={styles.video}>
            <video width="100%" controls>
              <source
                src={seven.media}
              />
            </video>
            <p> {seven.description?.replace(/&nbsp;/g, '')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SevenDetail;

export async function getStaticPaths() {

  const sevens = await getAllSevens();
  const validSevens = !sevens ? [] : sevens.filter((item) => item);
  const paths = validSevens.map((seven) => ({
    params: { id: seven?.id, slug: slugify(seven?.title || '') },
  }));

  return { paths, fallback: true };
}

export const getStaticProps = async ({ params }: SevenParams) => {

  const seven = await getSevenById(params.slug);

  if (!seven) {
    return {
      notFound: true,
      revalidate: 5,
    };
  }

  return {
    props: {
      seven,
    },
    revalidate: 5,
  };
};