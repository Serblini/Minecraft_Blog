const ApiError = require('../error/ApiError');
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')

const generateJwt = (id, email, name, role) => {
  return jwt.sign(
    { id, email, name, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  )
}

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, name, role } = req.body
      if (!email || !password || !name) {
        return next(ApiError.badRequest('Некорректный email, password или nickname'))
      }

      const candidate = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { name }
          ]
        }
      })
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email или nickname уже существует'))
      }

      const hashPassword = await bcrypt.hash(password, 5)
      const user = await User.create({ email, name, role, password: hashPassword })
      const basket = await Basket.create({ userId: user.id })
      const token = generateJwt(user.id, user.email, user.name, user.role)
      return res.json({ token })
    }
    catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async login(req, res, next) {
    const { email, password, name } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'))
    }
    const token = generateJwt(user.id, user.email, user.name, user.role)
    return res.json({ token })
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.role)
    return res.json({ token })
  }

  async getAll(req, res) {
    const users = await User.findAndCountAll()
    return res.json({ users })
  }
}

module.exports = new UserController()
