import React from 'react'
import DishCard from './DishCard'
import { Dish } from '@/types/Dish'

type Props = {
  dishes : Dish[];
}

const DishGrid = ({dishes} : Props) => {

  // const {dishes} = useDishStore();

  return (
    <div className='grid grid-cols-2 md:grid-cols-6 gap-2'>
        {dishes.map((dish) => (
          <div key={dish.id}>
            <DishCard dish={dish}/>
        </div>
        ))}
    </div>
  )
}

export default DishGrid