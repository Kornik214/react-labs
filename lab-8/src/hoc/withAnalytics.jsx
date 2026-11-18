import { track } from '../analytics.js'

export function withAnalytics(Component, event) {
  function TrackedComponent({ analyticsData, onClick, ...props }) {
    function handleClick(e) {
      track(event, analyticsData)
      onClick?.(e)
    }

    return <Component {...props} onClick={handleClick} />
  }

  const componentName =
    Component.displayName || Component.name || 'Component'
  TrackedComponent.displayName = `withAnalytics(${componentName})`

  return TrackedComponent
}