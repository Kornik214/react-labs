import { useState } from 'react'

/**
 * Показує перші `step` елементів з `items` і кнопку, що показує наступні.
 *
 * Використання:
 *   <ShowMore items={reviews} step={3}>
 *     {(visibleItems) => <ul>…</ul>}
 *   </ShowMore>
 *
 * Вимоги — у тестах tests/ShowMore.test.jsx.
 */
export default function ShowMore({ items, step, children }) {
  const [count, setCount] = useState(step)

  const visibleItems = items.slice(0, count)
  const hiddenCount = items.length - visibleItems.length
  const hasToggle = items.length > step

  function handleToggle() {
    if (hiddenCount > 0) {
      setCount((prev) => Math.min(prev + step, items.length))
    } else {
      setCount(step)
    }
  }

  return (
    <>
      {children(visibleItems)}
      {hasToggle && (
        <button type="button" className="show-more" onClick={handleToggle}>
          {hiddenCount > 0
            ? `Показати ще ${Math.min(step, hiddenCount)}`
            : 'Згорнути'}
        </button>
      )}
    </>
  )
}