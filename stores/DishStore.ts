import { Dish } from '@/types/Dish'
import {create} from 'zustand'

type DishStoreType = {
    dishes : Dish[],
    setDishes: (dishes : Dish[]) => void;
    decrementServings : (dishID : string, amount : number) => void;
    servingSetToday : boolean;
    markSetServing : () => void;
}


export const useDishStore = create<DishStoreType>((set, get) => ({
    dishes : [],
    servingSetToday : false,
    setDishes : (dishes) => {
        set({dishes : dishes});
    },
    decrementServings: (dishID, amount) => {
        const { dishes } = get()
        const existing = dishes.find((item) => item.id === dishID)

        if (!existing) return

        set({
            dishes: dishes.map((item) =>
            item.id === dishID
                ? { ...item, servings: Math.max(0,item.servings - amount) }
                : item
            ),
        })
    },

    markSetServing : () => set({servingSetToday : true})
}));