const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const ObjectId = Schema.ObjectId

const TemplateSchema = new Schema({
  // 名称
  title: { type: String, default: '未命名' },
  // 简介
  desc: String,
  // 备注
  remark: String,
  // 热门类型
  type_hot: String,
  // 场景类型
  type_scene: String,
  // 限时免费时间
  free_limit: { type: Number, default: 0 },
  // 价格
  price: { type: Number, default: 0 },
  // 浏览量
  viewcount: { type: Number, default: 0 },
  // 模板使用量
  amount: { type: Number, default: 0 },
  // 收费还是免费
  type: { type: Number, default: 0 },
  // 分类
  tplclass: { type: Number, default: 0 },
  // 标签
  tags: String,
  // 创建者
  creater: { type: Schema.Types.ObjectId, ref: 'Account' },
  // 创建时间
  createtime: { type: Date, default: Date.now },
  // 修改时间
  updatetime: { type: Date, default: Date.now }
  // 页面列表，一个模板拥有多个pages
  // pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }]
})

exports.TemplateModel = mongoose.model('Template', TemplateSchema)
