const apiKey = process.env.API_KEY || 'fa49e7487fe0447f8543d91fe121df2d'
const BASE_URL = 'https://api.spoonacular.com/recipes'

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) throw new Error('API key not found')

  const url = new URL(`${BASE_URL}/complexSearch`)

  const queryParams = {
    apiKey,
    query: searchTerm,
    number: '10',
    offset: (page * 10).toString(),
  }

  url.search = new URLSearchParams(queryParams).toString()

  try {
    const searchResponse = await fetch(url)
    const searchToJson = await searchResponse.json()
    return searchToJson
  } catch (error) {
    console.error(error)
  }
}

export const getRecipeSummaryById = async (recipeId: string) => {
  if (!apiKey) throw new Error('API key not found')

  const url = new URL(`${BASE_URL}/${recipeId}/summary`)

  const queryParams = {
    apiKey,
  }
  url.search = new URLSearchParams(queryParams).toString()

  try {
    const recipeResponse = await fetch(url)
    if (!recipeResponse.ok) throw new Error('Error fetching recipe summary')
    return await recipeResponse.json()
  } catch (error) {
    console.error(error)
  }
}

export const getFavoritesRecipesByIds = async (ids: string[]) => {
  if (!apiKey) throw new Error('API key not found')

  const url = new URL(`${BASE_URL}/informationBulk`)

  const queryParams = {
    apiKey,
    ids: ids.join(','),
  }

  url.search = new URLSearchParams(queryParams).toString()

  try {
    const fetchRecipesByIds = await fetch(url)
    if (!fetchRecipesByIds.ok) throw new Error('Error fetching recipes by ids')
    const recipesToJson = await fetchRecipesByIds.json()
    return { results: recipesToJson }
  } catch (error) {
    console.log(
      '🚀 ~ file: recipes-api.ts:63 ~ getFavoritesRecipesById s ~ error:',
      error
    )
  }
}
