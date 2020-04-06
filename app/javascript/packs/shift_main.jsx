import React from 'react'
import ReactDOM from 'react-dom'
import ShiftMain from '../components/shift_users/ShiftMain'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ShiftMain />,
    document.body.querySelector('#react_root'),
  )
});
