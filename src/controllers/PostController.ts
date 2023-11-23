import { Request, Response } from 'express'
import User from '../models/User'
import Post from '../models/Post'

export class PostController {
  async create(req: Request, res: Response) {
    const { user_id, description, images } = req.body
    try {
      const user = await User.findById(user_id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const newPost = await Post.create({
        user_id: user._id,
        description,
        images,
        likes: 0,
        comments: []
      })

      return res.status(201).json(newPost)

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async get(req: Request, res: Response) {
    try {
      const posts = await Post.find()
      return res.json(posts)
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params
    try {
      const post = await Post.findById(id)
      if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' })
      }

      return res.json(post)
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}