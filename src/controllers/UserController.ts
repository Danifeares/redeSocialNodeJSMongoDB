import { Request, Response } from 'express'
import User from '../models/User'

export class UserController {

  async get(req: Request, res: Response) {

    try {
      const users = await User.find()
      return res.json(users)

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    try {
      // const user = await User.findOne({ _id: id }) TEM DUAS FORMAS DE FAZER, ASSIM OU COM FINDBYID
      const user = await User.findById(id)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      return res.json(user)

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      username,
      photo,
      description
    } = req.body

    try {
      const existisUserEmailOrUsername = await User.findOne({
        $or: [{ email }, { username }]
      })

      if (existisUserEmailOrUsername) {
        return res.status(400).json({ message: 'Email ou nome de usuário já existe.' })
      }

      const newUser = await User.create({
        name,
        email,
        username,
        photo,
        description,
        isActive: true,
        isVerified: false,
        createdAt: new Date()
      })

      return res.status(201).json(newUser)

    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}