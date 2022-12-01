import type { ReactNode, RefObject } from "react";
import React, { memo, useRef } from 'react';
import type { DropTargetHookSpec, DropTargetMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import {
  dragSourceSpec,
  handleDrop,
  hoverIndexHelper,
  hoverShouldBeIgnored,
} from './helpers/dnd-helpers';
import type { EditorDndEvents, EditorDndItem } from './helpers/dnd-types';
import { ItemType } from './helpers/dnd-types';
import styles from './DroppableDraggableComponent.module.css';

export const dropTargetSpec = (
  targetItem: EditorDndItem,
  events: EditorDndEvents,
  dragRef: RefObject<HTMLDivElement>,
  previewRef: RefObject<HTMLDivElement>
): DropTargetHookSpec<any, any, any> => ({
  accept: Object.values(ItemType),
  collect(monitor) {
    return { canDrop: monitor.canDrop() };
  },
  canDrop(draggedItem: EditorDndItem, monitor: DropTargetMonitor) {
    return monitor.isOver({ shallow: true });
  },
  drop(droppedItem: EditorDndItem, monitor: DropTargetMonitor) {
    handleDrop(droppedItem, monitor, events.onDropItem, targetItem.containerId, targetItem.index);
  },
  hover(draggedItem: EditorDndItem, monitor: DropTargetMonitor) {
    if (hoverShouldBeIgnored(monitor, draggedItem)) {
      return;
    }
    if (
      hoverIndexHelper(
        draggedItem,
        targetItem,
        previewRef?.current?.getBoundingClientRect(),
        monitor.getClientOffset()
      )
    ) {
      events.moveItem(draggedItem, targetItem);
    }
  },
});

export interface IDroppableDraggableComponentProps {
  canDrag: boolean;
  children?: ReactNode;
  containerId: string;
  dndEvents: EditorDndEvents;
  id: string;
  index: number;
}

export const DroppableDraggableComponent = memo(function DroppableDraggableComponent({
  canDrag,
  children,
  containerId,
  dndEvents,
  id,
  index,
}: IDroppableDraggableComponentProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const item = { id, containerId, index, type: ItemType.Item };
  const [{ isDragging }, drag] = useDrag(dragSourceSpec(item, canDrag, dndEvents.onDropItem));

  const [{ isDroppable }, drop] = useDrop(dropTargetSpec(item, dndEvents, dragRef, previewRef));
  const opacity = isDragging && !isDroppable ? 0.5 : 1;
  const background = isDragging ? 'inherit !important' : undefined;

  drag(drop(previewRef));
  return (
    <div className={styles.root} style={{ opacity, background }} ref={previewRef}>
      <div className={styles.handle} ref={dragRef}>
        <div className={styles.points}>
          <div className={styles.point}/>
          <div className={styles.point}/>
          <div className={styles.point}/>
          <div className={styles.point}/>
          <div className={styles.point}/>
          <div className={styles.point}/>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
});
