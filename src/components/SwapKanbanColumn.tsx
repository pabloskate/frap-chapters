import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';
import type { SwapStatus } from '../types';

interface SwapKanbanColumnProps {
  status: SwapStatus;
  columnClassName: string;
  title: string;
  count: number;
  domId: string;
  itemIds: string[];
  children: ReactNode;
}

export function SwapKanbanColumn({
  status,
  columnClassName,
  title,
  count,
  domId,
  itemIds,
  children,
}: SwapKanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className={`kanban-column ${columnClassName}`}>
      <div className="kanban-column-header">
        <span className="kanban-column-title">{title}</span>
        <span className="kanban-count">{count}</span>
      </div>
      <div className="kanban-cards" id={domId} ref={setNodeRef}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </div>
  );
}
