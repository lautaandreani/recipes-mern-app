import { Result } from '../models/types'

type Props = {
  recipe: Result
  handleFavoriteRecipe: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    recipeId: number
  ) => Promise<unknown>
  isFavorite?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const RecipeCard = ({
  recipe,
  isFavorite,
  handleFavoriteRecipe,
  ...props
}: Props) => {
  return (
    <div className='cursor-pointer border border-[#333] p-2 rounded' {...props}>
      <img
        src={recipe.image}
        alt={recipe.title}
        className='object-cover min-h-[10rem]'
      />
      <hr className='mt-2 border-dark_gray' />
      <section className='flex gap-2 items-center'>
        <span
          role='button'
          className={`text-lg font-semibold ${
            isFavorite ? 'text-indigo-500' : ''
          }`}
          onClick={(e) => handleFavoriteRecipe(e, recipe.id)}
        >
          {isFavorite ? '★' : '☆'}
        </span>
        <p className='truncate max-w-[20rem] text-sm'>{recipe.title}</p>
      </section>
    </div>
  )
}
