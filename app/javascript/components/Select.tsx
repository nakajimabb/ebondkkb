import React, {FormEvent} from 'react';

interface Props {
    name?: string;
    options: {label: string, value: string | number}[];
    prompt?: string;
    value: string | number;
    onChange: (e: FormEvent) => void;
    className?: string;
    style?: {};
}

const Select: React.FC<Props> = ({value, options, prompt=null, onChange, ...other}) => {
  return (
      <select onChange={onChange} {...other} >
          { prompt !== null && <option>{ prompt }</option> }
          { options.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
          )) }
      </select>
  );
};

export default Select;
