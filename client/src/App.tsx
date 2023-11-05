import { useRef, useState } from 'react'
import { Result } from './models/types'
import * as api from './api'
import { RecipeCard } from './components/recipe-card'
import { RecipeModal } from './components/recipe-modal'
import { FavoriteTab } from './components/favorite-tab'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState<Result[]>([])
  const [currentRecipe, setCurrentRecipe] = useState(0)
  const [currentTab, setCurrentTab] = useState<'recipes' | 'favorites'>(
    'recipes'
  )
  const currentPage = useRef(1)

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    try {
      const results = await api.getRecipes(searchTerm, currentPage.current)
      if (!results) return null
      setRecipes(results)
      currentPage.current = 1
    } catch (error) {
      console.error(error)
    }
  }

  const onClickViewMoreRecipes = async () => {
    currentPage.current = currentPage.current + 1
    try {
      const nextRecipes = await api.getRecipes(searchTerm, currentPage.current)

      if (!nextRecipes?.length) return null
      setRecipes((prev) => [...prev, ...nextRecipes])
    } catch (error) {
      console.error(error)
    }
  }

  const handleFavoriteRecipe = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    recipeId: number
  ) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const response = await api.addRecipeToFavorite(recipeId)
      if (!response) throw new Error('Error saved in favorite')
      return response
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className='max-w-1/2 w-1/2 mx-auto my-4'>
      <h1 className='text-3xl font-medium text-center mt-2'>Recipes app</h1>
      <section className='flex gap-3'>
        {['recipes', 'favorites'].map((tabValue) => (
          <span
            key={tabValue}
            role='button'
            onClick={() => setCurrentTab(tabValue as 'favorites' | 'recipes')}
            className={`transition ${
              currentTab === tabValue
                ? 'border-b-2 border-indigo-400 text-white'
                : 'text-dark_gray'
            }`}
          >
            {tabValue}
          </span>
        ))}
      </section>
      {currentTab === 'recipes' && (
        <>
          <form
            onSubmit={handleSearchSubmit}
            className='flex flex-col items-center'
          >
            <div className='flex flex-col gap-2 mt-2 w-full'>
              <label htmlFor='search-term' className='text-sm'>
                Search term
              </label>
              <input
                type='text'
                id='search-term'
                className='bg-black border border-dark_gray rounded-md p-2 text-white placeholder:text-slate-400 outline-none'
                autoFocus
                placeholder='burger, italian'
                autoComplete='off'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type='submit'
                className={`px-2 py-1 border border-dark_gray bg-soft_gray rounded-md transition ${
                  !searchTerm ? 'text-dark_gray cursor-not-allowed' : ''
                }`}
                disabled={!searchTerm}
              >
                Search
              </button>
            </div>
          </form>
          <section className='grid grid-cols-4 mx-auto gap-4 mt-4'>
            {recipes &&
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setCurrentRecipe(recipe.id)}
                  handleFavoriteRecipe={handleFavoriteRecipe}
                />
              ))}
          </section>

          {recipes.length > 1 && (
            <button
              onClick={onClickViewMoreRecipes}
              className='flex mx-auto mt-4 px-3 py-1 border border-dark_gray bg-soft_gray rounded-md'
            >
              View more
            </button>
          )}
        </>
      )}

      {currentTab === 'favorites' && (
        <FavoriteTab setCurrentRecipe={setCurrentRecipe} />
      )}

      {!!currentRecipe && (
        <RecipeModal
          currentRecipe={currentRecipe}
          onClose={() => setCurrentRecipe(0)}
        />
      )}
    </main>
  )
}

export default App
