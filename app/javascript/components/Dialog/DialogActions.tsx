import React, {FormEvent} from 'react';

interface Props {
  children?: any;
}

export const DialogActions: React.FC<Props> = ({children}) => {
  return (
    <div className="modal-footer justify-content-between">
      { children }
    </div>
  );
};
