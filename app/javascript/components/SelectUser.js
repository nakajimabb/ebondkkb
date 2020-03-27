import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import 'react-select/dist/react-select.cjs';
import axios from 'axios';
import { name_with_code } from '../tools/name_with_code';
import env from '../environment';

const SelectUser = ({
  isClearable,
  isDisabled = false,
  name,
  value,
  shop = true,
  onChange,
}) => {
  const promiseOptions = (input) =>
    new Promise((resolve) => {
      const url = `${env.API_ORIGIN}/users.json?search=${input}&shop=${shop}`;
      axios.get(url).then((response) => {
        const options = response.data.map((user) => ({
          label: name_with_code(user),
          value: user.id,
        }));
        resolve(options);
      });
    });

  return onChange ? (
    <AsyncSelect
      name={name}
      value={value}
      onChange={onChange}
      isClearable={isClearable}
      isDisabled={isDisabled}
      loadOptions={promiseOptions}
    />
  ) : (
    <AsyncSelect
      name={name}
      defaultValue={value}
      isClearable={isClearable}
      isDisabled={isDisabled}
      loadOptions={promiseOptions}
    />
  );
};

export default SelectUser;
