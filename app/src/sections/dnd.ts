import type { DragEvent } from 'react';

/** HTML5 drag-and-drop helpers. Every drag target also works by click (select a card, then a box), so mouse is never required. */
export const dragSource = (id: string, enabled = true) => ({
  draggable: enabled,
  onDragStart: (e: DragEvent) => e.dataTransfer.setData('text/plain', id),
});

export const dropTarget = (onDrop: (id: string) => void) => ({
  onDragOver: (e: DragEvent) => e.preventDefault(),
  onDrop: (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id);
  },
});
