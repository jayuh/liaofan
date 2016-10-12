/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 图片组件
 */
const ImageSchema = new Schema({
  borderStyle: { type: String, default: 'none' },
  borderColor: { type: String, default: '#000000' },
  borderWidth: { type: String, default: '0px' },
  borderRadius: { type: String, default: '0px' },
  opacity: { type: String, default: '1' },
  backgroundColor: { type: String, default: '#000000' },
  boxShadow: { type: String, default: 'transparent 0px 0px 0px 0px' },
  transform: { type: String, default: 'rotate(0deg)' },
  width: { type: String, default: '100px' },
  height: { type: String, default: '100px' },
  left: { type: String, default: '0' },
  top: { type: String, default: '0' },
  zIndex: { type: String, default: '10' }
})
/**
 * 文字组件
 */
const TextSchema = new Schema({
  borderStyle: { type: String, default: 'none' },
  borderColor: { type: String, default: '#000000' },
  borderWidth: { type: String, default: '0px' },
  borderRadius: { type: String, default: '0px' },
  opacity: { type: String, default: '1' },
  backgroundColor: { type: String, default: '#000000' },
  boxShadow: { type: String, default: 'transparent 0px 0px 0px 0px' },
  transform: { type: String, default: 'rotate(0deg)' },
  width: { type: String, default: '120px' },
  height: { type: String, default: '40px' },
  fontWeight: { type: String, default: 'bold' },
  textDecoration: { type: String, default: 'none' },
  fontStyle: { type: String, default: 'italic' },
  textAlign: { type: String, default: 'center' },
  lineHeight: { type: Number, default: 1.5 },
  fontSize: { type: String, default: '14px' },
  fontFamily: { type: String, default: 'Microsoft YaHei' },
  whiteSpace: { type: String, default: 'pre-wrap' },
  textShadow: { type: String, default: 'transparent 0px 0px 0px' },
  left: { type: String, default: '87px' },
  color: { type: String, default: 'rgb(0,0,0)' },
  top: { type: String, default: '89px' },
  zIndex: { type: Number, default: 10 }
})
/**
 * 无素
 */
const ElementSchema = new Schema({
  // 所属应用ID
  // appid: { type: Schema.Types.ObjectId, ref: 'App' },
  // 元素
  pageid: { type: Schema.Types.ObjectId, ref: 'Page' },
  // 页面名称
  name: { type: String, default: '未命名' },
  // 页面背景
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
  // 创建者
  creater: { type: Schema.Types.ObjectId, ref: 'Account' },
  // 创建时间
  createtime: { type: Date, default: Date.now },
  // 修改时间
  updatetime: { type: Date, default: Date.now }
})

exports.ElementsModel = mongoose.model('Element', ElementSchema)
