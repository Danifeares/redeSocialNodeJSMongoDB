import { Request, Response } from 'express'
import User from '../models/User'
import Post from '../models/Post'
import { Types } from 'mongoose'
import { uploadFile } from '../services/uploads'

export class PostController {
  async create(req: Request, res: Response) {
    const { user_id, description } = req.body
    try {
      const user = await User.findById(user_id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const files = req.files as Express.Multer.File[]

      const images = await Promise.all(files.map(async file => {
        const img = await uploadFile(`postagens/${file.originalname}`, file.buffer, file.mimetype)
        return img
      }))

      const newPost = await Post.create({
        user_id: user._id,
        description,
        images,
        likes: [],
        comments: []
      })

      return res.status(201).json(newPost)

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async get(req: Request, res: Response) {
    try {
      const posts = await Post.aggregate([
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.user_id',
            foreignField: '_id',
            as: 'comments.user'
          }
        },
        {
          $unwind: {
            path: '$comments.user',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            comments: {
              '$push': '$comments'
            }
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: '_id',
            as: 'postDetails'
          }
        },
        {
          $unwind: {
            path: '$postDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            'postDetails.comments': '$comments'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$postDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $addFields: {
            user: { $first: '$user' }
          }
        },
        {
          $addFields: {
            likes: {
              $cond: {
                if: { $isArray: '$likes' },
                then: { $size: '$likes' },
                else: 0
              }
            }
          }
        }

      ])
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

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { description } = req.body
    try {
      const post = await Post.findById(id)

      if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' })
      }

      await Post.updateOne({ _id: id }, { description })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const post = await Post.findById(id)

      if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' })
      }

      await Post.deleteOne({ _id: id })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async likePost(req: Request, res: Response) {
    const { id } = req.params
    const { user_id } = req.body
    try {
      const post = await Post.findById(id)

      if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' })
      }

      // await Post.updateOne({ _id: id }, { $inc: { likes: 1 } })

      const user = await User.findById(user_id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      const likeExists = post.likes.find(like => String(like) === user_id)

      if (likeExists) {
        await Post.updateOne({ _id: id }, {
          $pull: {
            likes: user._id
          }
        })
        return res.status(204).json()
      }

      await Post.updateOne({ _id: id }, {
        $push: {
          likes: user._id
        }
      })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async commentPost(req: Request, res: Response) {
    const { id } = req.params
    const { user_id, description } = req.body
    try {
      const post = await Post.findById(id)

      if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' })
      }

      const user = await User.findById(user_id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      await Post.updateOne({ _id: id }, {
        $push: {
          comments: {
            _id: new Types.ObjectId(),
            user_id: user._id,
            description
          }
        }
      })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}