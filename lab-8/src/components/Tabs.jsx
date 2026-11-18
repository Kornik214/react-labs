import { createContext, use, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs.Tab and Tabs.Panel must be used inside <Tabs>')
  }
  return context
}

function TabsList({ children, ...props }) {
  return (
    <div className="tab-list" {...props}>
      {children}
    </div>
  )
}

function TabsTab({ value, children, ...props }) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isSelected = activeTab === value

  return (
    <button
      type="button"
      className={isSelected ? 'active' : undefined}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, children, ...props }) {
  const { activeTab } = useTabsContext()
  const isSelected = activeTab === value

  return (
    <div hidden={!isSelected} {...props}>
      {children}
    </div>
  )
}

export default function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel