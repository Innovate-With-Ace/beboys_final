import {create} from 'zustand'
import { Ingredient } from '@/types/Ingredients'


type IngredientEditorStoreType = {
    isOpen : boolean,
    isEditing : boolean,
    selectedIngredient : Ingredient | null,
    openForEdit : (ing :  Ingredient) => void;
    openForCreate : () => void;
    close : () => void;
}


export const  useIngredientEditorStore = create<IngredientEditorStoreType>((set, get) => ({
    isOpen : false,
    isEditing : false,
    selectedIngredient : null,
    openForEdit : (ing) => set({isOpen : true, selectedIngredient : ing, isEditing : true}),
    openForCreate : () => set({isOpen : true, selectedIngredient : null, isEditing : false}),
    close : () => set({isOpen : false, selectedIngredient : null, isEditing : false})
}))