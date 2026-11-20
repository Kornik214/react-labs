const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const lastNumber = orders.reduce(
    (max, order) => Math.max(max, order.number),
    0,
  )
  return { orders, lastNumber }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const order = {
        ...action.order,
        number: nextNumber,
        status: 'new',
        items: action.order.items.map((item) => ({ ...item, done: false })),
      }
      return {
        ...state,
        lastNumber: nextNumber,
        orders: [...state.orders, order],
      }
    }
    case 'item_toggled': {
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item.id === action.itemId
                    ? { ...item, done: !item.done }
                    : item,
                ),
              }
            : order,
        ),
      }
    }
    case 'order_advanced': {
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? { ...order, status: nextStatus[order.status] }
            : order,
        ),
      }
    }
    case 'order_cancelled': {
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.orderId),
      }
    }
    case 'customer_renamed': {
      const order = state.orders.find(
        (o) => o.customer.id === action.customerId,
      )
      return {
        ...state,
        orders: state.orders.map((o) =>
          o === order
            ? { ...o, customer: { ...o.customer, name: action.name } }
            : o,
        ),
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.filter((order) => order.status === status)
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  return state.orders.find((order) => order.id === id)
}
