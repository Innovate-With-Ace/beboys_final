import { Dish } from "@/types/Dish"

export const mockDishes: Dish[] = [
  {
    id: '1', name: 'Adobo', price: 60, servings: 8, servings_left: 8, category_id: '1', isAvailable: true,
    ingredients: [
      { id: '1', quantity: 0.2 },  // Pork 200g
      { id: '2', quantity: 0.03 }, // Soy sauce 30ml
      { id: '6', quantity: 0.02 }, // Vinegar 20ml
    ],
  },
  {
    id: '2', name: 'Sinigang', price: 65, servings: 2, servings_left: 2, category_id: '2', isAvailable: true,
    ingredients: [
      { id: '1', quantity: 0.25 }, // Pork 250g
      { id: '4', quantity: 0.05 }, // Tamarind 50g
    ],
  },
  {
    id: '3', name: 'Pancit', price: 55, servings: 0, servings_left: 0, category_id: '3', isAvailable: false,
    ingredients: [
      { id: '5', quantity: 0.01 }, // Garlic 10g
      { id: '8', quantity: 0.02 }, // Cooking oil 20ml
    ],
  },
  {
    id: '4', name: 'Rice', price: 15, servings: 20, servings_left: 20, category_id: '4', isAvailable: true,
    ingredients: [
      { id: '3', quantity: 0.15 }, // Rice 150g
    ],
  },
  {
    id: '5', name: 'Iced tea', price: 20, servings: 15, servings_left: 15, category_id: '5', isAvailable: true,
    ingredients: [],
  },
  {
    id: '6', name: 'Lumpia', price: 10, servings: 30, servings_left: 30, category_id: '6', isAvailable: true,
    ingredients: [
      { id: '8', quantity: 0.05 }, // Cooking oil 50ml
    ],
  },
  {
    id: '7', name: 'Sisig', price: 75, servings: 5, servings_left: 5, category_id: '1', isAvailable: true,
    ingredients: [
      { id: '1', quantity: 0.3 },  // Pork 300g
      { id: '5', quantity: 0.015 }, // Garlic 15g
      { id: '7', quantity: 1 },     // Eggs 1pc
    ],
  },
  {
    id: '8', name: 'Kare-kare', price: 85, servings: 1, servings_left: 1, category_id: '1', isAvailable: true,
    ingredients: [
      { id: '1', quantity: 0.35 }, // Pork 350g
      { id: '5', quantity: 0.01 }, // Garlic 10g
    ],
  },
  {
    id: '9', name: 'Halo-halo', price: 45, servings: 0, servings_left: 0, category_id: '7', isAvailable: false,
    ingredients: [],
  },
  {
    id: '10', name: 'Bottled water', price: 15, servings: 25, servings_left: 25, category_id: '5', isAvailable: true,
    ingredients: [],
  },
]