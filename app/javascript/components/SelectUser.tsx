import React, {FormEvent} from 'react';
import AsyncSelect from 'react-select/async';
import 'react-select/dist/react-select.cjs';
import axios from 'axios';

import { name_with_code } from '../tools/name_with_code';
import env from '../environment';

interface Props {
  isClearable?: boolean;
  isDisabled?: boolean;
  name?: string;
  value: {label: string, value: number};
  shop?: boolean;
  onChange: (e: FormEvent) => void;
}

const SelectUser: React.FC<Props> = ({isClearable=true,
                                     isDisabled=false,
                                     name,
                                     value,
                                     shop=true,
                                     onChange}) => {
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
