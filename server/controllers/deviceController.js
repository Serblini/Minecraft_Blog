const uuid = require('uuid')
const path = require('path');
const { Device, DeviceInfo, Brand } = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, description, nickname, typeId, brandId } = req.body
      const { img } = req.files
      let fileName = uuid.v4() + ".jpg"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      let brand = await Brand.findOne({ where: { name: nickname } })
      if (!brand) {
        brand = await Brand.create({ name: nickname })
      }
      brandId = brand.id
      console.log(`brand.id: ${brand.id}`)

      const device = await Device.create({ name, description, brandId, typeId, img: fileName });
      // if (info) {
      //     info = JSON.parse(info)
      //     info.forEach(i =>
      //         DeviceInfo.create({
      //             title: i.title,
      //             description: i.description,
      //             deviceId: device.id
      //         })
      //     )
      // }

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }

  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset })
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset })
    }
    return res.json(devices)
  }

  async getOne(req, res) {
    const { id } = req.params
    const device = await Device.findOne(
      {
        where: { id },
        // include: [{model: DeviceInfo, as: 'info'}]
      },
    )
    return res.json(device)
  }

  async deleteOne(req, res) {
    const { id } = req.params
    let post = await Device.findOne({ where: { id }, },)
    await Device.destroy({ where: { id }, },)
    console.log(`Удалён post: ${post}`)

    const brandIdAtDevice = post.brandId;
    console.log(`post.brandId: ${post.brandId}`)
    let otherPost = await Device.findOne({ where: { brandId: brandIdAtDevice } })
    if (!otherPost) {
      var brand = await Brand.findOne({ id: brandIdAtDevice })
      await Brand.destroy({ where: { id: brandIdAtDevice } })
      console.log(`Удалён brand: ${brand}`)
    }

    return res.json(post)
  }
}

module.exports = new DeviceController()
