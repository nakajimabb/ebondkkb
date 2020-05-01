import React from 'react'
import ReactDOM from 'react-dom'
import { csrfToken } from '@rails/ujs';
import axios from 'axios';
import { AppContextProvider } from '../components/shift_users/AppContext'
import ShiftMain from '../components/shift_users/ShiftMain'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    (<AppContextProvider>
      <ShiftMain />
    </AppContextProvider>),
    document.body.querySelector('#react_root'),
  )
});

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();
