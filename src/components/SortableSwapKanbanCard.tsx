import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SwapTypeIcon } from './SwapTypeIcon';
import type { Member, SwapItem } from '../types';

interface SortableSwapKanbanCardProps {
  swap: SwapItem;
  chapterMembers: Member[];
  viewingAs: string;
  getSwapTypeLabel: (type: SwapItem['type']) => string;
  moveSwap: (id: string, status: SwapItem['status']) => void;
  onOpenDetail: () => void;
}

export function SortableSwapKanbanCard({
  swap,
  chapterMembers,
  viewingAs,
  getSwapTypeLabel,
  moveSwap,
  onOpenDetail,
}: SortableSwapKanbanCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: swap.id });

  const fromMember = chapterMembers.find((member) => member.name === swap.from);
  const toMember = chapterMembers.find((member) => member.name === swap.to);
  const isYours = viewingAs === swap.from;
  const isIncoming = viewingAs === swap.to && swap.status !== 'done';
  const isDone = swap.status === 'done';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isYours ? 'yours' : ''} ${isDone ? 'done-card' : ''} ${
        isDragging ? 'kanban-card--dragging' : ''
      }`}
    >
      <button
        aria-label={`Drag to reorder or move to another column: ${getSwapTypeLabel(swap.type)}`}
        className="kanban-card-drag-handle"
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
      >
        <svg
          aria-hidden
          className="kanban-card-drag-handle-icon"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="8" cy="7" r="2.25" />
          <circle cx="16" cy="7" r="2.25" />
          <circle cx="8" cy="12" r="2.25" />
          <circle cx="16" cy="12" r="2.25" />
          <circle cx="8" cy="17" r="2.25" />
          <circle cx="16" cy="17" r="2.25" />
        </svg>
      </button>
      <div
        aria-label={`${getSwapTypeLabel(swap.type)}: ${swap.from} promoting ${swap.to}. Open details.`}
        className="kanban-card-body"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('button')) {
            return;
          }

          onOpenDetail();
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return;
          }

          if ((event.target as HTMLElement).closest('button')) {
            return;
          }

          event.preventDefault();
          onOpenDetail();
        }}
        role="button"
        tabIndex={0}
      >
        <div className="card-swap-type">
          <SwapTypeIcon type={swap.type} width={16} height={16} />
          {getSwapTypeLabel(swap.type)}
        </div>
        <div className="card-members">
          <div className="card-member-row">
            <img src={fromMember?.photo} alt={swap.from} />
            <div className="card-member-info">
              <div className="card-member-name">{swap.from}</div>
              <div className="card-member-biz">{swap.fromBiz}</div>
            </div>
          </div>
          <div className="card-promoting-label">↓ promoting</div>
          <div className="card-member-row">
            <img src={toMember?.photo} alt={swap.to} />
            <div className="card-member-info">
              <div className="card-member-name">{swap.to}</div>
              <div className="card-member-biz">{swap.toBiz}</div>
            </div>
          </div>
        </div>
        {isDone ? (
          <div className="card-done-badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="14"
              height="14"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed
          </div>
        ) : isYours && swap.status === 'assigned' ? (
          <button
            className="card-action-btn start"
            onClick={(event) => {
              event.stopPropagation();
              moveSwap(swap.id, 'in-progress');
            }}
            type="button"
          >
            Start Task
          </button>
        ) : isYours && swap.status === 'in-progress' ? (
          <button
            className="card-action-btn complete"
            onClick={(event) => {
              event.stopPropagation();
              moveSwap(swap.id, 'done');
            }}
            type="button"
          >
            Mark Done ✓
          </button>
        ) : isIncoming ? (
          <div className="card-incoming-badge">Incoming for you</div>
        ) : null}
      </div>
    </div>
  );
}

interface SwapKanbanCardDragPreviewProps {
  swap: SwapItem;
  chapterMembers: Member[];
  getSwapTypeLabel: (type: SwapItem['type']) => string;
}

/** Lightweight clone for <DragOverlay /> (not a sortable item). */
export function SwapKanbanCardDragPreview({
  swap,
  chapterMembers,
  getSwapTypeLabel,
}: SwapKanbanCardDragPreviewProps) {
  const fromMember = chapterMembers.find((member) => member.name === swap.from);
  const toMember = chapterMembers.find((member) => member.name === swap.to);

  return (
    <div className="kanban-card kanban-card--overlay">
      <div className="card-swap-type">
        <SwapTypeIcon type={swap.type} width={16} height={16} />
        {getSwapTypeLabel(swap.type)}
      </div>
      <div className="card-members">
        <div className="card-member-row">
          <img src={fromMember?.photo} alt="" />
          <div className="card-member-info">
            <div className="card-member-name">{swap.from}</div>
            <div className="card-member-biz">{swap.fromBiz}</div>
          </div>
        </div>
        <div className="card-promoting-label">↓ promoting</div>
        <div className="card-member-row">
          <img src={toMember?.photo} alt="" />
          <div className="card-member-info">
            <div className="card-member-name">{swap.to}</div>
            <div className="card-member-biz">{swap.toBiz}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
