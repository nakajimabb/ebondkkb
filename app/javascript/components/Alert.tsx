import React from 'react';
import clsx from 'clsx';

interface Props {
  open?: boolean;
  severity: 'danger' | 'info' | 'warning' | 'success';
  children?: any;
}

const Alert: React.FC<Props> = ({open=true, severity, children}) => {
  if(!open) return null;
  return (
    <div className={clsx('alert', `alert-${severity}`)}>
      { children }
    </div>
  );
};

export default Alert;
