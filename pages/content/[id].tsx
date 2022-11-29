import { NextPage } from 'next'
import { PreviewContext, PreviewProps } from '../../components/previewContext'

import Head from 'next/head'
import React, { ReactElement, useState } from 'react'
import { createApolloClient } from '../../utility/GraphQLApolloClient'
import { gql } from '@apollo/client'
import { logViewEvent } from '../../utility/CdpService'
import styles from '../../styles/Home.module.css'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import GrainIcon from '@mui/icons-material/Grain'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FILE_DOMAIN_URL = process.env.FILE_DOMAIN_URL || ''

export interface SevensItem extends PreviewProps {
  sitecoreSeven_Id: string
  sitecoreSeven_Createdon: Date
  sitecoreSeven_Title: string
  sitecoreSeven_Summary: string
  assetFileName: string
  assetId: string
  relativeUrl: string
  versionHash: string
}

export interface SevensProps extends PreviewProps {
  sevensList: Array<SevensItem>
}

const GET_CURRENT_CONTENT = gql`
  query Item($id: ID!) {
    allM_Content_SitecoreSeven(where: { id_eq: $id }) {
      results {
        id
        sitecoreSeven_Title
        sitecoreSeven_Summary
        cmpContentToLinkedAsset(first: 1) {
          results {
            fileName
            id
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

const Content: NextPage<SevensProps> = (props): ReactElement<any> => {
  const [sevensItem, setSevensItem] = useState(props.sevensList)

  logViewEvent({
    page: 'landing page',
    content_hub_id: sevensItem[0].sitecoreSeven_Id,
  })
  const logView = (id, eventType) => {
    logViewEvent({ type: eventType, content_hub_id: id })
  }

  return (
    <PreviewContext.Provider value={props}>
      <div className={styles.container}>
        <Head>
          <title>
            Sitecore 7s -{' '}
            {sevensItem[0].sitecoreSeven_Title.replace(/&nbsp;/g, '')}
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
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {sevensItem[0].sitecoreSeven_Title.replace(/&nbsp;/g, '')}
            </Typography>
          </Breadcrumbs>
        </div>

        <div>
          <h1 className={styles.title}>
            {sevensItem[0].sitecoreSeven_Title.replace(/&nbsp;/g, '')}
          </h1>
          <div className={styles.video}>
            <video width="100%" controls>
              <source
                src={
                  FILE_DOMAIN_URL +
                  '/' +
                  sevensItem[0].relativeUrl +
                  '?' +
                  sevensItem[0].versionHash
                }
              />
            </video>
            <p> {sevensItem[0].sitecoreSeven_Summary.replace(/&nbsp;/g, '')}</p>
          </div>
        </div>
      </div>
    </PreviewContext.Provider>
  )
}

export async function getServerSideProps(context) {
  const myclient = createApolloClient(false).getClient()
  const { data } = await myclient.query({
    query: GET_CURRENT_CONTENT,
    variables: {
      id: context.query.id,
    },
  })
  try {
    const theSevens = data?.allM_Content_SitecoreSeven.results
    const theSevensProps = theSevens.map((SevensItem) => {
      return {
        sitecoreSeven_Title: SevensItem.sitecoreSeven_Title,
        sitecoreSeven_Summary: SevensItem.sitecoreSeven_Summary,
        sitecoreSeven_Image: SevensItem.sitecoreSeven_Image
          ? SevensItem.sitecoreSeven_Image
          : '',
        sitecoreSeven_Id: SevensItem.id,
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
        sevensList: theSevensProps,
        preview: context.preview ?? false,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        sevensList: {},
        preview: context.preview ?? false,
      },
    }
  }
}

export default Content
