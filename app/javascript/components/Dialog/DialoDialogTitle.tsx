import React, {FormEvent} from 'react';

interface Props {
  onClose?: (e: FormEvent) => void;
  children?: any;
}

export const DialogTitle: React.FC<Props> = ({onClose, children}) => {
  return (
    <div className="modal-header">
      <h4 className="modal-title">
        { children }
      </h4>
      {
        onClose && (
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" onClick={onClose}>×</span>
          </button>
        )
      }
    </div>
  );
};
