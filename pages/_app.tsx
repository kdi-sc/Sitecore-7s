import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../styles/globals.css'

import * as React from 'react'

import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import type { AppProps } from 'next/app'
import { CdpScripts } from '../utility/CdpService'
import createEmotionCache from '../utility/createEmotionCache'
import lightThemeOptions from '../styles/theme/lightThemeOptions'

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  session: Session
}

const clientSideEmotionCache = createEmotionCache()

const lightTheme = createTheme(lightThemeOptions)

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, session, pageProps } = props

  return (
    <SessionProvider session={session}>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
      {CdpScripts}
    </CacheProvider>
    </SessionProvider>
  )
}

export default MyApp
