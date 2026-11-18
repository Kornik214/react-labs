import { createContext, use, useId, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs.Tab and Tabs.Panel must be used inside <Tabs>')
  }
  return context
}

function TabsList({ children, onKeyDown, ...props }) {
  function handleKeyDown(e) {
    onKeyDown?.(e)

    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return

    const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'))
    const currentIndex = tabs.indexOf(document.activeElement)
    if (currentIndex === -1) return

    e.preventDefault()

    let nextIndex = currentIndex
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const nextTab = tabs[nextIndex]
    nextTab.focus()
    nextTab.click()
  }

  return (
    <div
      role="tablist"
      className="tab-list"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTab({ value, children, onClick, ...props }) {
  const { activeTab, setActiveTab, baseId } = useTabsContext()
  const isSelected = activeTab === value

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isSelected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={(e) => {
        setActiveTab(value)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, children, ...props }) {
  const { activeTab, baseId } = useTabsContext()
  const isSelected = activeTab === value

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={!isSelected}
      {...props}
    >
      {children}
    </div>
  )
}

export default function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const baseId = useId()

  return (
    <TabsContext value={{ activeTab, setActiveTab, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel
