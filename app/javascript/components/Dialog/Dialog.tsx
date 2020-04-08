import React from 'react';

interface Props {
  title: string;
  onClose: any;
  children?: any;
}

export const Dialog: React.FC<Props> = ({title, onClose, children}) => {
  return (
    <div className="modal fade show" id="modal-default" style={{display: 'block'}} aria-modal="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            { children }
          </div>
        </div>
      </div>
    </div>
  );
};
