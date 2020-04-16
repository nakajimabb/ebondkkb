import React from 'react'
import ReactDOM from 'react-dom'
import { csrfToken } from '@rails/ujs';
import axios from 'axios';
import ShiftMain from '../components/shift_users/ShiftMain'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ShiftMain />,
    document.body.querySelector('#react_root'),
  )
});

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();
