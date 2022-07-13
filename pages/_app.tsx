import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import createEmotionCache from '../utility/createEmotionCache';
import lightThemeOptions from '../styles/theme/lightThemeOptions';
import '../styles/globals.css';
import { CdpScripts, logViewEvent } from '../utility/CdpService';
import { ApolloProvider } from "@apollo/client";
import useGraphQLApolloClient from "../utility/GraphQLApolloBrowserClient";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
 
  return (
    <CacheProvider value={emotionCache}>  
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
      {CdpScripts}
    </CacheProvider>
  );
};

export default MyApp;
