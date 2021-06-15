import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createMuiTheme, ThemeProvider as ThemeProviderMaterial } from "@material-ui/core/styles";
import 'fontsource-roboto';

import App from './App';

const GRAPHQL_API_URL = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-testing';

const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache()
});

const themeMaterial = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#0E6FE2",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: "#000",
      main: "#0E6FE2",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#000",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

render(
  <ApolloProvider client={client}>
    <ThemeProviderMaterial theme={themeMaterial}>
      <App />
    </ThemeProviderMaterial>
  </ApolloProvider>,
  document.getElementById('root')
);
