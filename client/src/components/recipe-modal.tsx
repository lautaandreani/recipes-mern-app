import { useEffect, useState } from 'react'
import { Recipe } from '../models/types'
import * as api from '../api'

type Props = {
  currentRecipe: number
  onClose: () => void
}

export const RecipeModal = ({ currentRecipe, onClose }: Props) => {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined)

  useEffect(() => {
    api
      .getRecipeSummaryById(currentRecipe)
      .then(setRecipe)
      .catch((error) => console.error(error))
  }, [])

  if (!recipe?.id) return null

  return (
    <>
      <div
        className='overlay backdrop-blur-sm flex items-center justify-center fixed w-full h-screen top-0 left-0 bg-black/50'
        id='recipe-modal'
      >
        <dialog className='flex flex-col gap-2 p-4 max-w-[40rem] rounded-md bg-black border border-[#333] text-white'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-xl truncate'>{recipe.title}</h3>
            <button type='button' onClick={onClose}>
              ✕
            </button>
          </div>
          <hr className='border border-[#333]' />
          <span
            className='[&>a]:text-blue-500 [&>a]:underline'
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          ></span>
        </dialog>
      </div>
    </>
  )
}
