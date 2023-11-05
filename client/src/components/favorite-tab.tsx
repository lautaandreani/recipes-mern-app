import { useEffect, useState } from 'react'

import * as api from '../api'
import { Result } from '../models/types'
import { RecipeCard } from './recipe-card'

type Props = {
  setCurrentRecipe: React.Dispatch<React.SetStateAction<number>>
}

export function FavoriteTab({ setCurrentRecipe }: Props) {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Result[]>([])

  useEffect(() => {
    api
      .getFavoritesRecipes()
      .then((res) => res?.length && setFavoriteRecipes(res))
      .catch((error) => console.error(error))
  }, [])

  const filterDeletedRecipe = (recipeId: number) => {
    console.log(
      '🚀 ~ file: favorite-tab.tsx:22 ~ filterDeletedRecipe ~ recipeId:',
      recipeId
    )
    setFavoriteRecipes(
      favoriteRecipes.filter((recipe) => recipe.id !== recipeId)
    )
  }

  const removeRecipeFromFavorite = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    recipeId: number
  ) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const response = await api.removeRecipeFromFavorite(recipeId)
      if (!response.recipeId) throw new Error('Error delete recipe')
      filterDeletedRecipe(response.recipeId)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  if (!favoriteRecipes.length) {
    return (
      <span className='mt-2 flex justify-center'>
        Here you can see your favorite recipes
      </span>
    )
  }

  return (
    <section className='grid grid-cols-4 mx-auto gap-4 mt-4'>
      {favoriteRecipes &&
        favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setCurrentRecipe(recipe.id)}
            handleFavoriteRecipe={removeRecipeFromFavorite}
            isFavorite
          />
        ))}
    </section>
  )
}
