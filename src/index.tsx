import { render } from 'react-dom';
import 'focus-visible/dist/focus-visible';
import 'fontsource-roboto';
import { ChakraProvider, CSSReset } from "@chakra-ui/react"
import { css, Global } from '@emotion/react';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import App from './App';

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider>
        <CSSReset />
        <Global styles={GlobalStyles} />
        <App />
      </ChakraProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
