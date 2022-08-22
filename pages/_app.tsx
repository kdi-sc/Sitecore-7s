import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";

import * as React from "react";

import { CacheProvider, EmotionCache } from "@emotion/react";
import { CdpScripts, logViewEvent } from "../utility/CdpService";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import createEmotionCache from "../utility/createEmotionCache";
import lightThemeOptions from "../styles/theme/lightThemeOptions";
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
