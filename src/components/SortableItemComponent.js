import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, src, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: String(id) });

  const cardStyle = {
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    borderRadius: '4px',
    padding: '8px',
    margin: '8px',
    textAlign: 'center',
    position: 'relative',
    width: '95%',
    height: 'fit-content',
    paddingBottom: '16px',
  };

  const buttonStyle = {
    marginTop: '8px',
    color: '#fff',
    background: '#E57373', // Softer red color
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    marginBottom: '8px',
  };

  return (
    <div style={cardStyle}>
      <div
        ref={setNodeRef}
        style={{
          ...imageStyle,
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        {...attributes}
        {...listeners}>
        <img src={src} alt={`Property`} style={imageStyle} />
      </div>
      <button type="button" onClick={() => onRemove(id)} style={buttonStyle}>
        Remove
      </button>
    </div>
  );
};
