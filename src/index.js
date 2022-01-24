import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';
import App from './App';


const rootEl = document.getElementById('root') || document.createElement('div')
function renderDOM() {
  if (rootEl) {
    ReactDOM.render(<App />, rootEl)
  }
  return rootEl
}
renderDOM()
export { renderDOM }