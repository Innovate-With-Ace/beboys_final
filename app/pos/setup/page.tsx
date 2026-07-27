// app/pos/setup/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useDishStore } from '@/stores/DishStore'
import { Soup } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { mockDishes } from '@/data/dishes'

const SetupPage = () => {
    const router = useRouter();
  const { dishes, setDishes } = useDishStore()
  const [draftServings, setDraftServings] = useState<Record<string, number>>({})

  useEffect(() => {
    setDishes(mockDishes)
  }, [])

  useEffect(() => {
    const initial = Object.fromEntries(dishes.map((d) => [d.id, d.servings]))
    setDraftServings(initial)
  }, [dishes.length])

  const handleChange = (id: string, value: string) => {
    const num = Math.max(0, Number(value) || 0)
    setDraftServings((prev) => ({ ...prev, [id]: num }))
  }

    const handleSave = () => {
    const updated = dishes.map((dish) => ({
        ...dish,
        servings: draftServings[dish.id] ?? dish.servings,
    }))
    setDishes(updated)
    useDishStore.getState().markSetServing()
    router.push('/pos')
    }

  return (
    <main className="bg-bg min-h-screen p-4 max-w-md mx-auto">
      <div className="mb-4">
        <h1 className="font-heading font-semibold text-lg">Set today&apos;s servings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          {' · '}Enter how many servings of each dish are available today
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-bg-muted rounded-lg px-3 py-2.5 flex items-center gap-2.5"
          >
            <div className="size-9 rounded-md bg-bg shrink-0 flex items-center justify-center">
              <Soup className="size-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium">{dish.name}</span>
            <input
              type="number"
              min={0}
              value={draftServings[dish.id] ?? 0}
              onChange={(e) => handleChange(dish.id, e.target.value)}
              className="w-16 text-center border border-border rounded-md py-1.5 text-sm bg-bg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-4 bg-brand-primary text-white rounded-md py-2.5 text-sm font-medium hover:bg-brand-primary/90"
      >
        Save and start shift
      </button>
    </main>
  )
}

export default SetupPage