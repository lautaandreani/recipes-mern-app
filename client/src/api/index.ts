import { Recipe, Result } from '../models/types'

const BASE_URL = import.meta.env.VITE_APP_RECIPES_URL

export const getRecipes = async (
  searchTerm: string,
  page = 1
): Promise<Result[] | undefined> => {
  const url = new URL(`${BASE_URL}/api/recipes/search`)

  url.searchParams.append('searchTerm', searchTerm)
  url.searchParams.append('page', page.toString())

  try {
    const searchResponse = await fetch(url)
    if (!searchResponse.ok)
      throw new Error(`Search error Status: ${searchResponse.status}`)
    const responseToJson = await searchResponse.json()

    return responseToJson.results
  } catch (error) {
    console.error(error)
  }
}

export const getRecipeSummaryById = async (
  recipeId: number
): Promise<Recipe | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}/summary`)
    if (!response.ok) throw new Error('Error fetching recipe summary')

    const responseToJson = (await response.json()) as Recipe
    return responseToJson
  } catch (error) {
    console.error(error)
  }
}

export const addRecipeToFavorite = async (recipeId: number) => {
  const payload = {
    recipeId,
  }

  try {
    const response = await fetch(`${BASE_URL}/api/recipes/favorite`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error try add to favorite')
  }
}

export const getFavoritesRecipes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/recipes/favorite`)
    if (!response.ok) throw new Error('Error fetching favorites recipes')
    const responseToJson = (await response.json()) as { results: Result[] }
    return responseToJson.results
  } catch (error) {
    console.error(error)
  }
}

export const removeRecipeFromFavorite = async (recipeId: number) => {
  const payload = {
    recipeId,
  }

  try {
    const response = await fetch(`${BASE_URL}/api/recipes/favorite`, {
      method: 'DELETE',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error try add to favorite')
  }
}
