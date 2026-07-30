import {create} from 'zustand'
import { Ingredient } from '@/types/Ingredients'


type InventoryStoreType = {
    ingredients : Ingredient[];
    setIngredients : (ing : Ingredient[]) => void;
    addIngredient : (ing : Ingredient) => void;
    removeIngredient : (ing : Ingredient) => void;
    updateIngredient : (ing : Ingredient) => void;
}


export const useInventoryStore = create<InventoryStoreType>((set, get) => ({
    ingredients : [],
    setIngredients : (ing) => {
        return set({ingredients : Array.isArray(ing) ? ing : []});
    },
    addIngredient  : (ing) => {
        set({ingredients : [...get().ingredients, ing]});
    },
    removeIngredient : (ing) => {
        const newIngredients = get().ingredients.filter((i) => i.id !== ing.id);
        set({ingredients : newIngredients});
    },

    updateIngredient: (ing) => {
        set((state) => ({
            ingredients: state.ingredients.map((item) =>
            item.id === ing.id ? { ...item, ...ing } : item
            ),
        }))
        }
}))