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
        return;
    },
    addIngredient  : (ing) => {
        return;
    },
    removeIngredient : (ing) => {
        return;
    }
}))