import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const ImageReorderComponent = () => {
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = event => {
    const fileReader = new FileReader();
    const file = event.target.files[0];

    fileReader.onloadend = () => {
      setItems(prevItems => [...prevItems, fileReader.result]);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const handleDragEnd = event => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item === active.id);
        const newIndex = items.findIndex(item => item === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <h3>Upload and Reorder Images</h3>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(src => (
            <SortableItem key={src} id={src} src={src} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImageReorderComponent;
