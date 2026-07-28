import {create} from 'zustand'
import { Ingredient } from '@/types/Ingredients'


type InventoryStoreType = {
    ingredients : Ingredient[];
    setIngredients : (ing : Ingredient[]) => void;
    addIngredient : (ing : Ingredient) => void;
    removeIngredient : (ing : Ingredient) => void;
}


export const useInventoryStore = create<InventoryStoreType>((set, get) => ({
    ingredients : [],
    setIngredients : (ing) => {
        return set({ingredients : ing});
    },
    addIngredient  : (ing) => {
        set({ingredients : [...get().ingredients, ing]});
    },
    removeIngredient : (ing) => {
        return;
    }
}))