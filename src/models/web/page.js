const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 一个page只属于一个APP
 * 一个page只属于一个user
 * 一个page拥有多个elements
 */
const PageSchema = new Schema({
  // 元素列表
  elements: [{ type: Schema.Types.ObjectId, ref: 'Element' }],
  // 页面名称
  pagename: { type: String, default: '未命名' },
  // 页面背景
  style: {
    // 背景图片
    backgroundImage: String,
    // 背景色
    backgroundColor: { type: String, default: '#ffffff' }
  },
  // 滑动
  disSwipable: { type: Boolean, default: false },
  // 页面点击效果
  eventData: Array,
  // 所属应用ID
  appid: { type: Schema.Types.ObjectId, required: true, ref: 'App' },
  // 创建者
  creater: { type: Schema.Types.ObjectId, ref: 'Account' },
  // 创建时间
  createtime: { type: Date, default: Date.now },
  // 修改时间
  updatetime: { type: Date, default: Date.now }
})

exports.PagesModel = mongoose.model('Page', PageSchema)
