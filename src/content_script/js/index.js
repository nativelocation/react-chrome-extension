import { h, render } from 'preact';
import { Provider, connect } from 'preact-redux';

import App from './components/App';
import store from './store';

import css from '../styles/style.css';

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.body);