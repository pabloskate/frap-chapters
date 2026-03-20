import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '../components/Layout';
import {
  SortableSwapKanbanCard,
  SwapKanbanCardDragPreview,
} from '../components/SortableSwapKanbanCard';
import { SwapKanbanColumn } from '../components/SwapKanbanColumn';
import { SwapTypeIcon } from '../components/SwapTypeIcon';
import {
  chapterMembers,
  getSwapTypeLabel,
  memberScores,
  monthNames,
  suggestedPairings,
  swapTypes,
} from '../data';
import { useLockedBody } from '../hooks/useLockedBody';
import { useAppState } from '../state/AppState';
import {
  applyKanbanColumnsToSwaps,
  buildKanbanColumnItems,
  findKanbanContainer,
} from '../swapBoard/kanbanColumnOrder';
import type { PairingSuggestion, SwapItem, SwapStatus, SwapTypeId } from '../types';

function swapStatusLabel(status: SwapStatus) {
  switch (status) {
    case 'assigned':
      return 'Assigned';
    case 'in-progress':
      return 'In progress';
    case 'done':
      return 'Done';
    default:
      return status;
  }
}

function scoreColor(score: number) {
  if (score >= 85) {
    return 'score-high';
  }

  if (score >= 75) {
    return 'score-mid';
  }

  return 'score-low';
}

function createSwapId() {
  return `s${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

interface SwapDetailModalProps {
  swap: SwapItem;
  viewingAs: string;
  onClose: () => void;
  onMoveStatus: (id: string, status: SwapItem['status']) => void;
}

function SwapDetailModal({
  swap,
  viewingAs,
  onClose,
  onMoveStatus,
}: SwapDetailModalProps) {
  const fromMember = chapterMembers.find((member) => member.name === swap.from);
  const toMember = chapterMembers.find((member) => member.name === swap.to);
  const isYours = viewingAs === swap.from;
  const isIncoming = viewingAs === swap.to && swap.status !== 'done';
  const isDone = swap.status === 'done';

  return (
    <div
      className="modal-overlay active"
      id="swapDetailModal"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-labelledby="swapDetailTitle"
        aria-modal="true"
        className="modal assign-modal-v2 swap-detail-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close swap details"
          className="modal-close"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <div className="modal-header-v2">
          <div className="swap-detail-modal-top">
            <span className={`swap-detail-status swap-detail-status--${swap.status}`}>
              {swapStatusLabel(swap.status)}
            </span>
          </div>
          <h2 className="modal-title-v2" id="swapDetailTitle">
            {getSwapTypeLabel(swap.type)}
          </h2>
          <p className="modal-subtitle-v2">
            {monthNames[swap.month]} {swap.year}
          </p>
        </div>

        <div className="swap-detail-members">
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
        </div>

        <div className="swap-detail-workflow">
          <div className="section-label-v2">Update status</div>
          {isDone ? (
            <>
              <p className="swap-detail-workflow-text">
                This swap is finished and marked complete.
              </p>
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
            </>
          ) : null}
          {isYours && swap.status === 'assigned' ? (
            <>
              <p className="swap-detail-workflow-text">
                When you start working on this promotion, move it to{' '}
                <strong>In progress</strong>.
              </p>
              <button
                className="card-action-btn start"
                onClick={() => onMoveStatus(swap.id, 'in-progress')}
                type="button"
              >
                Move to in progress
              </button>
            </>
          ) : null}
          {isYours && swap.status === 'in-progress' ? (
            <>
              <p className="swap-detail-workflow-text">
                When the promotion is live or sent, mark it complete.
              </p>
              <button
                className="card-action-btn complete"
                onClick={() => onMoveStatus(swap.id, 'done')}
                type="button"
              >
                Mark as done
              </button>
            </>
          ) : null}
          {isIncoming ? (
            <>
              <p className="swap-detail-workflow-text">
                You&apos;re the member being promoted.{' '}
                <strong>{swap.from}</strong> updates the status as they run the swap.
              </p>
              <div className="card-incoming-badge">Incoming for you</div>
            </>
          ) : null}
          {!isDone && !isYours && !isIncoming ? (
            <p className="swap-detail-workflow-text swap-detail-workflow-muted">
              {viewingAs ? (
                <>
                  Only <strong>{swap.from}</strong> can move this swap forward. Switch
                  &quot;Viewing as&quot; to them to update status.
                </>
              ) : (
                <>
                  Only <strong>{swap.from}</strong> can move this swap forward. Choose
                  them in &quot;Viewing as&quot; to update status.
                </>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function BoardPage() {
  const { swaps, setSwaps } = useAppState();
  const [boardMonth, setBoardMonth] = useState(2);
  const [boardYear, setBoardYear] = useState(2026);
  const [viewingAs, setViewingAs] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedType, setSelectedType] = useState<SwapTypeId>('email');
  const [assignModalStep, setAssignModalStep] = useState<'suggestions' | 'manual'>(
    'suggestions',
  );
  const [detailSwapId, setDetailSwapId] = useState<string | null>(null);

  const detailSwap = detailSwapId
    ? swaps.find((swap) => swap.id === detailSwapId)
    : undefined;

  useLockedBody(isAssignModalOpen || Boolean(detailSwap));

  const closeAssignModal = useCallback(() => {
    setAssignModalStep('suggestions');
    setIsAssignModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isAssignModalOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (assignModalStep === 'manual') {
        setAssignModalStep('suggestions');
        return;
      }

      closeAssignModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isAssignModalOpen, assignModalStep, closeAssignModal]);

  useEffect(() => {
    if (!detailSwap || isAssignModalOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailSwapId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [detailSwap, isAssignModalOpen]);

  const monthSwaps = useMemo(
    () => swaps.filter((swap) => swap.month === boardMonth && swap.year === boardYear),
    [boardMonth, boardYear, swaps],
  );

  const isAlreadyAssigned = (fromName: string, toName: string) =>
    monthSwaps.some((swap) => swap.from === fromName && swap.to === toName);

  const buildDynamicSuggestions = () => {
    const dynamicSuggestions: PairingSuggestion[] = [];

    chapterMembers.forEach((fromMember) => {
      chapterMembers.forEach((toMember) => {
        if (fromMember.name === toMember.name) {
          return;
        }

        if (isAlreadyAssigned(fromMember.name, toMember.name)) {
          return;
        }

        const compatibility = memberScores[fromMember.name]?.[toMember.name];
        if (!compatibility) {
          return;
        }

        dynamicSuggestions.push({
          from: fromMember.name,
          fromBiz: fromMember.business,
          reason:
            compatibility.factors.join(' + ') || 'Strong compatibility',
          score: compatibility.score,
          to: toMember.name,
          toBiz: toMember.business,
          type: compatibility.suggestedType ?? 'email',
        });
      });
    });

    return dynamicSuggestions.sort((a, b) => b.score - a.score).slice(0, 6);
  };

  const currentSuggestedPairings =
    suggestedPairings.filter((pairing) => !isAlreadyAssigned(pairing.from, pairing.to))
      .length > 0
      ? suggestedPairings.filter(
          (pairing) => !isAlreadyAssigned(pairing.from, pairing.to),
        )
      : buildDynamicSuggestions();

  const viewingAsHint = viewingAs
    ? (() => {
        const activeCount = monthSwaps.filter(
          (swap) => swap.from === viewingAs && swap.status !== 'done',
        ).length;

        return activeCount > 0
          ? `You have ${activeCount} active swap${
              activeCount > 1 ? 's' : ''
            } to complete`
          : 'All your swaps are done!';
      })()
    : '';

  const sortedToOptions = selectedFrom
    ? chapterMembers
        .filter((member) => member.name !== selectedFrom)
        .map((member) => ({
          member,
          score: memberScores[selectedFrom]?.[member.name]?.score ?? 0,
        }))
        .sort((a, b) => b.score - a.score)
    : chapterMembers.map((member) => ({ member, score: 0 }));

  const addSwap = (newSwap: SwapItem) => {
    setSwaps((currentSwaps) => {
      const peers = currentSwaps.filter(
        (s) =>
          s.month === newSwap.month &&
          s.year === newSwap.year &&
          s.status === newSwap.status,
      );
      const maxOrder = peers.reduce((max, s) => Math.max(max, s.boardOrder ?? -1), -1);
      return [...currentSwaps, { ...newSwap, boardOrder: maxOrder + 1 }];
    });
  };

  const openAssignModal = () => {
    setSelectedFrom('');
    setSelectedTo('');
    setSelectedType('email');
    setAssignModalStep('suggestions');
    setIsAssignModalOpen(true);
  };

  const assignSuggestion = (pairing: PairingSuggestion) => {
    if (isAlreadyAssigned(pairing.from, pairing.to)) {
      return;
    }

    addSwap({
      from: pairing.from,
      fromBiz: pairing.fromBiz,
      id: createSwapId(),
      month: boardMonth,
      status: 'assigned',
      to: pairing.to,
      toBiz: pairing.toBiz,
      type: pairing.type,
      year: boardYear,
    });
    closeAssignModal();
  };

  const confirmAssign = () => {
    if (!selectedFrom || !selectedTo) {
      window.alert('Please select both members.');
      return;
    }

    if (selectedFrom === selectedTo) {
      window.alert('A member cannot swap with themselves.');
      return;
    }

    const fromMember = chapterMembers.find((member) => member.name === selectedFrom);
    const toMember = chapterMembers.find((member) => member.name === selectedTo);

    if (!fromMember || !toMember) {
      return;
    }

    addSwap({
      from: fromMember.name,
      fromBiz: fromMember.business,
      id: createSwapId(),
      month: boardMonth,
      status: 'assigned',
      to: toMember.name,
      toBiz: toMember.business,
      type: selectedType,
      year: boardYear,
    });
    closeAssignModal();
  };

  const moveSwap = (id: string, newStatus: SwapItem['status']) => {
    setSwaps((currentSwaps) => {
      const swap = currentSwaps.find((s) => s.id === id);
      if (!swap) {
        return currentSwaps;
      }

      const peers = currentSwaps.filter(
        (s) =>
          s.month === swap.month &&
          s.year === swap.year &&
          s.status === newStatus &&
          s.id !== id,
      );
      const maxOrder = peers.reduce((max, s) => Math.max(max, s.boardOrder ?? -1), -1);

      return currentSwaps.map((s) =>
        s.id === id ? { ...s, boardOrder: maxOrder + 1, status: newStatus } : s,
      );
    });
  };

  const derivedColumnItems = useMemo(
    () => buildKanbanColumnItems(monthSwaps),
    [monthSwaps],
  );

  const columnItemsRef = useRef(derivedColumnItems);
  const [optimisticColumnItems, setOptimisticColumnItems] = useState<
    Record<SwapStatus, string[]> | null
  >(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const columnItems = optimisticColumnItems ?? derivedColumnItems;

  useLayoutEffect(() => {
    if (optimisticColumnItems === null) {
      columnItemsRef.current = derivedColumnItems;
    }
  }, [derivedColumnItems, optimisticColumnItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const swapById = useMemo(() => {
    const map = new Map<string, SwapItem>();
    monthSwaps.forEach((s) => map.set(s.id, s));
    return map;
  }, [monthSwaps]);

  const handleDragStart = (event: DragStartEvent) => {
    const snapshot = buildKanbanColumnItems(monthSwaps);
    columnItemsRef.current = snapshot;
    setOptimisticColumnItems(snapshot);
    setActiveDragId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;
    if (overId == null) {
      return;
    }

    const activeContainer = findKanbanContainer(active.id, columnItemsRef.current);
    const overContainer = findKanbanContainer(overId, columnItemsRef.current);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setOptimisticColumnItems((items) => {
      if (!items) {
        return items;
      }

      const overItems = items[overContainer];
      const overIndex = overItems.indexOf(String(overId));

      let newIndex: number;
      if (overId === overContainer) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const next = {
        ...items,
        [activeContainer]: items[activeContainer].filter((id) => id !== String(active.id)),
        [overContainer]: [
          ...items[overContainer].slice(0, newIndex),
          String(active.id),
          ...items[overContainer].slice(newIndex, items[overContainer].length),
        ],
      };
      columnItemsRef.current = next;
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let nextColumns = columnItemsRef.current;

    if (!over) {
      nextColumns = buildKanbanColumnItems(monthSwaps);
      columnItemsRef.current = nextColumns;
      setOptimisticColumnItems(null);
      setActiveDragId(null);
      return;
    }

    const activeContainer = findKanbanContainer(active.id, nextColumns);
    const overContainer = findKanbanContainer(over.id, nextColumns);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = nextColumns[activeContainer].indexOf(String(active.id));
      const overIndex = nextColumns[overContainer].indexOf(String(over.id));

      if (activeIndex !== overIndex && overIndex >= 0) {
        nextColumns = {
          ...nextColumns,
          [overContainer]: arrayMove(nextColumns[overContainer], activeIndex, overIndex),
        };
      }
    }

    columnItemsRef.current = nextColumns;
    setSwaps((current) =>
      applyKanbanColumnsToSwaps(current, boardMonth, boardYear, nextColumns),
    );
    setOptimisticColumnItems(null);
    setActiveDragId(null);
  };

  const handleDragCancel = () => {
    const reset = buildKanbanColumnItems(monthSwaps);
    columnItemsRef.current = reset;
    setOptimisticColumnItems(null);
    setActiveDragId(null);
  };

  const columnConfig = [
    {
      colClass: 'col-assigned',
      count: columnItems.assigned.length,
      domId: 'cardsAssigned',
      itemIds: columnItems.assigned,
      status: 'assigned' as const,
      title: 'Assigned',
    },
    {
      colClass: 'col-in-progress',
      count: columnItems['in-progress'].length,
      domId: 'cardsInProgress',
      itemIds: columnItems['in-progress'],
      status: 'in-progress' as const,
      title: 'In Progress',
    },
    {
      colClass: 'col-done',
      count: columnItems.done.length,
      domId: 'cardsDone',
      itemIds: columnItems.done,
      status: 'done' as const,
      title: 'Done',
    },
  ];

  const activeDragSwap = activeDragId ? swapById.get(activeDragId) : undefined;

  return (
    <AppLayout
      activeNav="board"
      navVariant="chapter"
      title="Swap Board | Profit Academy"
    >
      <section className="view-section active" id="boardView">
        <header className="header">
          <div className="header-left">
            <h1>Swap Board</h1>
            <div className="month-selector">
              <button
                className="month-nav"
                id="boardPrevMonth"
                onClick={() => {
                  if (boardMonth === 0) {
                    setBoardMonth(11);
                    setBoardYear((currentYear) => currentYear - 1);
                    return;
                  }

                  setBoardMonth((currentMonth) => currentMonth - 1);
                }}
                title="Previous month"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span id="boardMonthLabel">{`${monthNames[boardMonth]} ${boardYear}`}</span>
              <button
                className="month-nav"
                id="boardNextMonth"
                onClick={() => {
                  if (boardMonth === 11) {
                    setBoardMonth(0);
                    setBoardYear((currentYear) => currentYear + 1);
                    return;
                  }

                  setBoardMonth((currentMonth) => currentMonth + 1);
                }}
                title="Next month"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <button
            className="create-swap-btn"
            id="openAssignModal"
            onClick={openAssignModal}
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="16"
              height="16"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Assign Swap
          </button>
        </header>

        <div className="viewing-as-bar">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
            style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="viewing-as-label">Viewing as</span>
          <select
            className="viewing-as-select"
            id="viewingAsSelect"
            onChange={(event) => setViewingAs(event.currentTarget.value)}
            value={viewingAs}
          >
            <option value="">— Everyone —</option>
            {chapterMembers.map((member) => (
              <option key={member.name} value={member.name}>
                {member.name} — {member.business}
              </option>
            ))}
          </select>
          <div
            className="viewing-as-hint"
            id="viewingAsHint"
            style={{ display: viewingAs ? 'block' : 'none' }}
          >
            {viewingAsHint}
          </div>
        </div>

        <DndContext
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <div className="kanban-board">
            {columnConfig.map((column) => (
              <SwapKanbanColumn
                columnClassName={column.colClass}
                count={column.count}
                domId={column.domId}
                itemIds={column.itemIds}
                key={column.status}
                status={column.status}
                title={column.title}
              >
                {column.itemIds.length === 0 ? (
                  <div className="empty-column">Nothing here yet</div>
                ) : (
                  column.itemIds.map((swapId) => {
                    const swap = swapById.get(swapId);
                    if (!swap) {
                      return null;
                    }

                    return (
                      <SortableSwapKanbanCard
                        chapterMembers={chapterMembers}
                        getSwapTypeLabel={getSwapTypeLabel}
                        key={swap.id}
                        moveSwap={moveSwap}
                        onOpenDetail={() => setDetailSwapId(swap.id)}
                        swap={swap}
                        viewingAs={viewingAs}
                      />
                    );
                  })
                )}
              </SwapKanbanColumn>
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeDragSwap ? (
              <SwapKanbanCardDragPreview
                chapterMembers={chapterMembers}
                getSwapTypeLabel={getSwapTypeLabel}
                swap={activeDragSwap}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>

      {detailSwap ? (
        <SwapDetailModal
          onClose={() => setDetailSwapId(null)}
          onMoveStatus={(id, status) => {
            moveSwap(id, status);
            setDetailSwapId(null);
          }}
          swap={detailSwap}
          viewingAs={viewingAs}
        />
      ) : null}

      <div
        className={`modal-overlay ${isAssignModalOpen ? 'active' : ''}`}
        id="assignModal"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeAssignModal();
          }
        }}
      >
        <div className="modal assign-modal-v2">
          <button
            className="modal-close"
            id="assignModalClose"
            onClick={closeAssignModal}
            type="button"
          >
            &times;
          </button>
          {assignModalStep === 'suggestions' ? (
            <>
              <div className="modal-header-v2">
                <h2 className="modal-title-v2">Assign a Swap</h2>
                <p className="modal-subtitle-v2">
                  AI-suggested pairings based on compatibility
                </p>
              </div>

              <div className="assign-modal-suggested-v2">
                <div className="section-label-v2">Top Matches</div>
                <div className="pairings-list-v2" id="suggestedPairingsGrid">
                  {currentSuggestedPairings.map((pairing, index) => {
                    const fromMember = chapterMembers.find(
                      (member) => member.name === pairing.from,
                    );
                    const toMember = chapterMembers.find(
                      (member) => member.name === pairing.to,
                    );
                    const isBestMatch = index === 0 && pairing.score >= 90;

                    return (
                      <div
                        className={`pairing-card-v2 ${isBestMatch ? 'best' : ''}`}
                        key={`${pairing.from}-${pairing.to}`}
                      >
                        <div className="match-score-v2">
                          <div className={`score-number-v2 ${scoreColor(pairing.score)}`}>
                            {pairing.score}%
                          </div>
                          <div className="score-label-v2">Match</div>
                        </div>
                        <div className="pairing-content-v2">
                          <div className="members-compact-v2">
                            <div className="avatar-stack-v2">
                              <img src={fromMember?.photo} alt={pairing.from} />
                              <img src={toMember?.photo} alt={pairing.to} />
                            </div>
                            <div className="member-names-v2">
                              {pairing.from} <span>&</span> {pairing.to}
                            </div>
                          </div>
                          <div className="swap-meta-v2">
                            <span className="swap-type-pill-v2">
                              <SwapTypeIcon type={pairing.type} width={12} height={12} />
                              {getSwapTypeLabel(pairing.type)}
                            </span>
                            <span className="swap-reason-v2">
                              · {pairing.reason.split(/\s*\+\s*/).filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                        <button
                          className="assign-btn-v2"
                          onClick={() => assignSuggestion(pairing)}
                          type="button"
                        >
                          Assign
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="divider-v2">or create manually</div>

              <button
                className="manual-btn-v2"
                onClick={() => {
                  setSelectedFrom('');
                  setSelectedTo('');
                  setSelectedType('email');
                  setAssignModalStep('manual');
                }}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                Custom Swap
              </button>
            </>
          ) : null}

          <div
            className={`manual-form-v2 ${assignModalStep === 'manual' ? 'manual-form-v2--step' : 'manual-form-v2--hidden'}`}
          >
            {assignModalStep === 'manual' ? (
              <>
                <div className="modal-header-v2 manual-form-header-v2">
                  <button
                    className="assign-modal-back-v2"
                    onClick={() => setAssignModalStep('suggestions')}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}>
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back to suggestions
                  </button>
                  <h2 className="modal-title-v2">Custom swap</h2>
                  <p className="modal-subtitle-v2">
                    Choose who sends, the swap type, and who they&apos;re promoting
                  </p>
                </div>
                <div className="form-group-v2">
                  <label className="form-label-v2">Who sends the swap?</label>
                  <select
                    className="form-select-v2"
                    id="fromMemberSelect"
                    onChange={(event) => {
                      const nextFrom = event.currentTarget.value;
                      setSelectedFrom(nextFrom);
                      setSelectedTo('');
                      setSelectedType('email');
                    }}
                    value={selectedFrom}
                  >
                    <option value="">Select member...</option>
                    {chapterMembers.map((member) => (
                      <option key={member.name} value={member.name}>
                        {member.name} — {member.business}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group-v2">
                  <label className="form-label-v2">Swap type</label>
                  <select
                    className="form-select-v2"
                    id="swapTypeSelect"
                    onChange={(event) =>
                      setSelectedType(event.currentTarget.value as SwapTypeId)
                    }
                    value={selectedType}
                  >
                    {swapTypes.map((swapType) => (
                      <option key={swapType.id} value={swapType.id}>
                        {swapType.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group-v2">
                  <label className="form-label-v2">Promoting which business?</label>
                  <select
                    className="form-select-v2"
                    id="toMemberSelect"
                    onChange={(event) => {
                      const nextTo = event.currentTarget.value;
                      setSelectedTo(nextTo);
                      const compatibility = memberScores[selectedFrom]?.[nextTo];
                      if (compatibility?.suggestedType) {
                        setSelectedType(compatibility.suggestedType);
                      }
                    }}
                    value={selectedTo}
                  >
                    <option value="">Select business to promote...</option>
                    {sortedToOptions.map(({ member, score }) => (
                      <option key={member.name} value={member.name}>
                        {score > 0
                          ? `${member.name} — ${member.business} (${score}% match)`
                          : `${member.name} — ${member.business}`}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary-v2" id="confirmAssign" onClick={confirmAssign} type="button">
                  Assign Swap
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
