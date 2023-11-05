// import dotenv from "dotenv"
// dotenv.config() Ver por que no funciona
import express from 'express'
import cors from 'cors'

import * as RecipeAPI from './recipes-api.ts'
import { PrismaClient } from '@prisma/client'

const app = express()
const prismaClient = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/api/recipes/search', async (req, res) => {
  const searchTerm = req.query.searchTerm as string
  const page = parseInt(req.query.page as string)

  const results = await RecipeAPI.searchRecipes(searchTerm, page)
  return res.json(results)
})

app.get('/api/recipes/:recipeId/summary', async (req, res) => {
  const recipeId = req.params.recipeId as string
  if (!recipeId) res.status(400).json({ message: 'Not found recipeId' })

  const results = await RecipeAPI.getRecipeSummaryById(recipeId)
  if (!results) res.status(400).json({ message: "The recipe doesn't exist" })
  return res.json(results)
})

app.post('/api/recipes/favorite', async (req, res) => {
  const recipeId = req.body.recipeId
  if (!recipeId) return res.status(400).json({ message: 'Not found recipeId' })

  try {
    const favouriteRecipe = await prismaClient.favoritesRecipes.create({
      data: {
        recipeId: parseInt(recipeId),
      },
    })

    return res.status(201).json(favouriteRecipe)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error saved favourite recipe' })
  }
})

app.get('/api/recipes/favorite', async (req, res) => {
  try {
    const recipes = await prismaClient.favoritesRecipes.findMany()
    const recipesId = recipes.map((recipe) => recipe.recipeId.toString())

    const results = await RecipeAPI.getFavoritesRecipesByIds(recipesId)
    return res.json(results)
  } catch (error) {
    console.error('Error fetching recipes')
    return res.status(400).json({ message: (error as Error).message })
  }
})

app.delete('/api/recipes/favorite', async (req, res) => {
  const recipeId = req.body.recipeId
  if (!recipeId) throw new Error('Not found recipeId')

  try {
    const deleteFavorite = await prismaClient.favoritesRecipes.delete({
      where: { recipeId },
    })
    return res.json(deleteFavorite)
  } catch (error) {
    console.error('Error deleting favorite recipe')
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on PORT ${process.env.PORT || 3000}`)
})
