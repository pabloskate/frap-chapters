import type { SwapItem, SwapStatus } from '../types';

export const SWAP_BOARD_STATUSES: SwapStatus[] = ['assigned', 'in-progress', 'done'];

export function compareSwapBoardOrder(a: SwapItem, b: SwapItem): number {
  const ao = a.boardOrder;
  const bo = b.boardOrder;
  if (ao != null && bo != null && ao !== bo) {
    return ao - bo;
  }

  if (ao != null && bo == null) {
    return -1;
  }

  if (ao == null && bo != null) {
    return 1;
  }

  return a.id.localeCompare(b.id);
}

export function buildKanbanColumnItems(
  monthSwaps: SwapItem[],
): Record<SwapStatus, string[]> {
  return {
    assigned: monthSwaps
      .filter((s) => s.status === 'assigned')
      .sort(compareSwapBoardOrder)
      .map((s) => s.id),
    'in-progress': monthSwaps
      .filter((s) => s.status === 'in-progress')
      .sort(compareSwapBoardOrder)
      .map((s) => s.id),
    done: monthSwaps
      .filter((s) => s.status === 'done')
      .sort(compareSwapBoardOrder)
      .map((s) => s.id),
  };
}

export function findKanbanContainer(
  id: string | number,
  columnItems: Record<SwapStatus, string[]>,
): SwapStatus | undefined {
  const sid = String(id);
  for (const status of SWAP_BOARD_STATUSES) {
    if (sid === status) {
      return status;
    }

    if (columnItems[status].includes(sid)) {
      return status;
    }
  }

  return undefined;
}

export function applyKanbanColumnsToSwaps(
  allSwaps: SwapItem[],
  month: number,
  year: number,
  columnItems: Record<SwapStatus, string[]>,
): SwapItem[] {
  const idToMeta = new Map<string, { status: SwapStatus; order: number }>();
  for (const status of SWAP_BOARD_STATUSES) {
    columnItems[status].forEach((swapId, index) => {
      idToMeta.set(swapId, { order: index, status });
    });
  }

  return allSwaps.map((swap) => {
    if (swap.month !== month || swap.year !== year) {
      return swap;
    }

    const meta = idToMeta.get(swap.id);
    if (!meta) {
      return swap;
    }

    return { ...swap, boardOrder: meta.order, status: meta.status };
  });
}
