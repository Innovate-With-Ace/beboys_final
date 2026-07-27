import {create} from 'zustand';
import { Dish } from '@/types/Dish';

type DishEditorStoreType = {
    isOpen : boolean,
    isEditing : boolean,
    selectedDish : Dish | null,
    openForEdit : (dish : Dish) => void;
    openForCreate : () => void;
    close : () => void;
}

export const useDishEditorStore = create<DishEditorStoreType>((set, get) =>  ({
    isOpen : false,
    isEditing : false,
    selectedDish : null,
    openForCreate : () => {
        set({isOpen : true, isEditing : false, selectedDish : null});
    },
    close : () => {
        set({isOpen : false, isEditing : false, selectedDish : null});
    },

    openForEdit : (dish) => {
        set({isOpen : true, isEditing : true, selectedDish : dish });
    } 
}));