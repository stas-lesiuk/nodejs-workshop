const Joi = require('joi')

const title = Joi.string().alphanum().min(3).max(30).required()

const productSchema = Joi.object().keys({
  title,
  desc: Joi.string(),
  price: Joi.number().greater(0).default(100).required()
})

const productsSchema = Joi.array().productSchema

const listingSchema = Joi.object().keys({
  offset: Joi.number().positive().default(0),
  limit: Joi.number().positive().default(10),
  fields: Joi.array().items(Joi.string().valid(productSchema._inner.children.map(c => c.key))).default(false)
})

const deleteSchema = {
  title
}

module.exports = {
  productSchema,
  productsSchema,
  listingSchema,
  deleteSchema
}