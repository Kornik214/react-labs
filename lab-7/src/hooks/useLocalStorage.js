import { useEffect, useState } from 'react'

/**
 * Стан, що зберігається в localStorage під ключем `key` у форматі JSON.
 *
 * Використання, як у useState:
 *   const [value, setValue] = useLocalStorage('grind', 'beans')
 *
 * Вимоги — у тестах tests/useLocalStorage.test.jsx.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        return JSON.parse(raw)
      }
    } catch {
      // Ігноруємо помилку парсингу, якщо в localStorage лежить не JSON
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}