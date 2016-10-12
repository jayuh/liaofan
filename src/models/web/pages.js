const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 一个page只属于一个APP
 * 一个page只属于一个user
 * 一个page拥有多个elements
 */
const PageSchema = new Schema({
  // 元素列表
  elements: [{
        // 元素名称
        name: { type: String, default: '' },
        // 元素样式
        style: Schema.Types.Mixed,
        // 动画
        animation: { type: Boolean, default: false },
        // 元素类型 text, image
        type: String,
        // 图片地址
        imgurl: String,
        // 指引
        maskType: String,
        // 指引图片
        maskImage: String,
        // 事件
        eventData: Array,
        // 创建时间
        createtime: { type: Date, default: Date.now },
        // 修改时间
        updatetime: { type: Date, default: Date.now }
  }],
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

exports.Pages = mongoose.model('Pages', PageSchema)
