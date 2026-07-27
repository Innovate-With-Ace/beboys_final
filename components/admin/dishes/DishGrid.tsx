import React from 'react'
import DishCard from './DishCard'
import { useDishStore } from '@/stores/DishStore'


const DishGrid = () => {

  const {dishes} = useDishStore();

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
        {dishes.map((dish) => (
          <div key={dish.id}>
            <DishCard dish={dish}/>
        </div>
        ))}
    </div>
  )
}

export default DishGrid