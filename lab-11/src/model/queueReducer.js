const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []
  let lastNumber = 0

  for (const order of orders) {
    lastNumber = Math.max(lastNumber, order.number)
    ordersById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }
    orderIds.push(order.id)

    if (!customersById[order.customer.id]) {
      customersById[order.customer.id] = {
        id: order.customer.id,
        name: order.customer.name,
      }
      customerIds.push(order.customer.id)
    }
  }

  return {
    orders: { byId: ordersById, ids: orderIds },
    customers: { byId: customersById, ids: customerIds },
    lastNumber,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const nextNumber = state.lastNumber + 1
      const { id, customer, items } = action.order

      const newOrder = {
        id,
        number: nextNumber,
        status: 'new',
        customerId: customer.id,
        items: items.map((item) => ({ ...item, done: false })),
      }

      const customerExists = Boolean(state.customers.byId[customer.id])
      const nextCustomers = customerExists
        ? state.customers
        : {
            byId: { ...state.customers.byId, [customer.id]: customer },
            ids: [...state.customers.ids, customer.id],
          }

      return {
        ...state,
        lastNumber: nextNumber,
        orders: {
          byId: { ...state.orders.byId, [id]: newOrder },
          ids: [...state.orders.ids, id],
        },
        customers: nextCustomers,
      }
    }

    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              items: order.items.map((item) =>
                item.id === action.itemId
                  ? { ...item, done: !item.done }
                  : item,
              ),
            },
          },
        },
      }
    }

    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              status: nextStatus[order.status],
            },
          },
        },
      }
    }

    case 'order_cancelled': {
      const nextById = { ...state.orders.byId }
      delete nextById[action.orderId]
      return {
        ...state,
        orders: {
          byId: nextById,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }

    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: {
              ...customer,
              name: action.name,
            },
          },
        },
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
  return state.orders.ids
    .map((id) => state.orders.byId[id])
    .filter((order) => order.status === status)
    .map((order) => ({
      ...order,
      customer: state.customers.byId[order.customerId],
    }))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  return {
    ...order,
    customer: state.customers.byId[order.customerId],
  }
}
