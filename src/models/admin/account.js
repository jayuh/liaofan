const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const ObjectId = Schema.ObjectId

const AccountSchema = new Schema({
  // 账号
  name: { type: String, required: true, unique: true },
  // 密码
  password: { type: String, required: true },
  // 昵称
  nickname: String,
  // 头像
  photo: String,
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
  created_at: Date,
  // 更新时间
  updated_at: Date
})

// 创建索引
AccountSchema.index({name: 1, type: -1})

exports.AccountModel = mongoose.model('Admin', AccountSchema)
