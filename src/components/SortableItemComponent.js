import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, src, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(id) });

  // Log to check if isDragging changes as expected

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab', // ensure dynamic update
  };

  const handleRemoveClick = (event) => {
    console.log("Remove button clicked");
    event.preventDefault();  // Prevent form submission
    onRemove(id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={src} alt={`Sortable thumbnail`} style={{ width: '200px', height: 'auto', marginBottom: '8px' }} />
      <button type="button" onClick={handleRemoveClick} style={{ cursor: 'pointer' }}>Remove</button>
    </div>
  );
};
