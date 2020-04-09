import React from 'react';
import Draggable from 'react-draggable';

interface Props {
  children?: any;
}

export const Dialog: React.FC<Props> = ({children}) => {
  return (
    <Draggable>
      <div className="modal fade show" style={{display: 'block'}} aria-modal="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              { children }
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};
