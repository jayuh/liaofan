const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 一个账户（Account）拥有多个APP
 */
const AccountSchema = new Schema({
  // 一个用户拥有多个作品
  apps: [{ type: Schema.Types.ObjectId, ref: 'App' }],
  // 账号
  name: { type: String, required: true, unique: true },
  // 密码
  password: { type: String, required: true },
  // 昵称
  nickname: String,
  // 账户来源
  from: String,
  // 账号等级
  level: Number,
  // 头像
  photo: String,
  // 状态
  state: Number,
  // 账户类型
  type: Number,
  // VIP开始
  vip_start: Date,
  // VIP结束
  vip_end: Date,
  // 联系信息
  contact: {
    // 机构
    organize: String,
    // 部门
    department: String,
    // 手机
    phone: String,
    // 邮箱
    email: String
  },
  // 创建时间
  createtime: { type: Date, default: Date.now },
  // 修改时间
  updatetime: { type: Date, default: Date.now }
})

// 创建索引
AccountSchema.index({name: 1, type: -1})

exports.AccountModel = mongoose.model('Account', AccountSchema)
