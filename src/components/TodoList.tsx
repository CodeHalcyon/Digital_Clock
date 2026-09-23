import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Todo = {
  id: string
  text: string
  done: boolean
}

const STORAGE_KEY = 'focus-desk-todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function TodoList({ className }: { className?: string }) {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const add = () => {
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, done: false },
      ...prev,
    ])
    setDraft('')
    inputRef.current?.focus()
  }

  const toggle = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )

  const remove = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id))

  const remaining = todos.filter((t) => !t.done).length

  return (
    <section
      className={cn('flex h-full flex-col', className)}
      aria-label="Todo list"
    >
      <header className="mb-5 flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-muted">
          Today
        </h2>
        <span className="font-mono text-xs tabular-nums text-faint">
          {remaining} open
        </span>
      </header>

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setDraft('')
              inputRef.current?.blur()
            }
          }}
          placeholder="Add a task…"
          aria-label="New task"
        />
        <button
          type="submit"
          aria-label="Add task"
          className={cn(
            'grid size-9 shrink-0 cursor-pointer place-items-center transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            draft.trim()
              ? 'bg-foreground text-background hover:bg-foreground/85'
              : 'text-faint',
          )}
        >
          <Plus className="size-4" strokeWidth={2} />
        </button>
      </form>

      <ul className="flex min-h-10 flex-1 flex-col overflow-y-auto pr-1">
        <AnimatePresence initial={false} mode="popLayout">
          {todos.length === 0 && (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-16 items-center justify-center font-mono text-xs text-faint"
            >
              no tasks yet
            </motion.li>
          )}

          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="group flex items-center gap-3 border-b border-border/70 py-2.5 transition-colors hover:bg-surface"
            >
              <Checkbox
                checked={todo.done}
                onCheckedChange={() => toggle(todo.id)}
                aria-label={`Mark "${todo.text}" ${todo.done ? 'incomplete' : 'complete'}`}
              />
              <label
                className={cn(
                  'min-w-0 flex-1 cursor-pointer break-words pr-1 text-sm text-foreground/90 transition-colors duration-200',
                  todo.done && 'text-muted line-through decoration-faint',
                )}
              >
                {todo.text}
              </label>
              <button
                onClick={() => remove(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="cursor-pointer text-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-muted focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {todos.length > 0 && (
        <button
          onClick={() => setTodos([])}
          className="mt-4 cursor-pointer self-start font-mono text-[11px] tracking-[0.2em] text-faint uppercase transition-colors hover:text-muted"
        >
          Clear all
        </button>
      )}
    </section>
  )
}