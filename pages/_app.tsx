import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../styles/globals.css'

import * as React from 'react'
import { initializeApp } from 'firebase/app';
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

const firebaseConfig = {
  apiKey: "AIzaSyDqxqR_61hR0fzzy0GdcOvmDCP_OjJYIC0",
  authDomain: "sitecore-7s.firebaseapp.com",
  projectId: "sitecore-7s",
  storageBucket: "sitecore-7s.appspot.com",
  messagingSenderId: "798976054914",
  appId: "1:798976054914:web:a119d1183b8bf10201869b"

};

const app = initializeApp(firebaseConfig);


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
