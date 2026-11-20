/** Історія, з якої починають: present і порожні past та future. */
export function createHistory(present) {
  return {
    past: [],
    present,
    future: [],
  }
}

export function withUndo(reducer, limit = 20) {
  return function undoableReducer(history, action) {
    const { past, present, future } = history

    switch (action.type) {
      case 'undo': {
        if (past.length === 0) return history
        const previous = past[past.length - 1]
        return {
          past: past.slice(0, -1),
          present: previous,
          future: [present, ...future],
        }
      }

      case 'redo': {
        if (future.length === 0) return history
        const [next, ...restFuture] = future
        return {
          past: [...past, present],
          present: next,
          future: restFuture,
        }
      }

      default: {
        const nextPresent = reducer(present, action)
        if (Object.is(nextPresent, present)) {
          return history
        }
        const nextPast = [...past, present]
        return {
          past: nextPast.length > limit ? nextPast.slice(-limit) : nextPast,
          present: nextPresent,
          future: [],
        }
      }
    }
  }
}
