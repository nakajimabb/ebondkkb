import React, {FormEvent} from 'react';

interface Props {
  onClose?: (e: FormEvent) => void;
  children?: any;
}

export const DialogContent: React.FC<Props> = ({children}) => {
  return (
    <div className="modal-body">
      { children }
    </div>
  );
};
