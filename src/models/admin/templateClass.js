const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TemplateClassSchema = new Schema({
  // 名称
  className: { type: String, required: true },
  // 依赖ID，一级类目为 'none''
  relyId: { type: String, require: true }
})

TemplateClassSchema.index({ id: 1 })

exports.TemplateClassModel = mongoose.model('TemplateClass', TemplateClassSchema)
