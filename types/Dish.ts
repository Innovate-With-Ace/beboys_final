import { Ingredient } from "./Ingredients";

export type Dish = {
    id : string;
    name : string;
    price : number;
    servings : number;
    servings_left : number;
    image? : string;
    category_id : string,
    // For now this is optional but we will require it sooner
    ingredients? : Ingredient[]
    isAvailable : boolean
}

