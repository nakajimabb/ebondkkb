import React, {FormEvent} from 'react';
import AsyncSelect from 'react-select/async';
import 'react-select/dist/react-select.cjs';
import axios from 'axios';
import { name_with_code, filter_properties } from '../tools/index';
import env from '../environment';

interface Props {
  isClearable?: boolean;
  isDisabled?: boolean;
  name?: string;
  dest_type?: string;
  value: {label: string, value: number};
  onChange: (e: FormEvent) => void;
}

const SelectDest: React.FC<Props> = ({isClearable=true,
                                     isDisabled=false,
                                     name,
                                     value,
                                     dest_type,
                                     onChange}) => {
  const promiseOptions = (input) =>
    new Promise((resolve) => {
      const url = `${env.API_ORIGIN}/dests.json`;
      let params = filter_properties({search: input, dest_type}, property => !!property);
      axios.get(url, {params}).then((response) => {
        const options = response.data.map((dest) => ({
          label: name_with_code(dest),
          value: dest.id,
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

export default SelectDest;
