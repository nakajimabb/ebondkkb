import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import 'react-select/dist/react-select.cjs';
import axios from 'axios';
import { name_with_code } from '../tools/name_with_code';
import env from '../environment';

const SelectUser = ({ name, value, onChange }) => {
  const promiseOptions = (input) =>
    new Promise((resolve) => {
      const url = `${env.API_ORIGIN}/users.json?search=${input}`;
      axios.get(url).then((response) => {
        const options = response.data.map((user) => ({
          label: name_with_code(user),
          value: user.id,
        }));
        resolve(options);
      });
    });

  return (
    <AsyncSelect
      name={name}
      value={value}
      onChange={onChange}
      loadOptions={promiseOptions}
    />
  );
};

export default SelectUser;
