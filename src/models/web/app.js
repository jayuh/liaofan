const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * 一个APP有属于一个用户
 * 一个APP拥有多个页面(pages)
 */
const AppSchema = new Schema({
  // 应用名称
  app_name: { type: String, required: true, default: '未命名应用' },
  // 基本设置
  app_config: {
    // 封面
    appImg: String,
    // 微信分享配置
    weixin: [{
      // 分享标题 | 应用标题
      title: String,
      // 分享描述 | 应用描述
      desc: String,
      // 分享图标
      imgUrl: String
    }],
    // 背景音乐
    music: {
      // 音乐地址: http://s8.qhmsg.com/static/16a92bbdd474ff32.mp3
      src: String,
      // 名称
      name: String,
      // 是否循环播放
      loop: { type: Boolean, default: false },
      // 是否自动播放
      auto: { type: Boolean, default: true }
    },
    // 自定义统计设置，无为false
    tongji: {
      // baidu, google
      type: String,
      // 标识
      id: String
    },
    // 加载效果
    loader: {
      // 'rabbit', 'default'
      type: { type: String, default: 'default' }
    },
    // 应用设置，动画效果
    carousel: {
      // 切换方向vertical
      direction: { type: String, default: 'vertical' },
      // 滑动,默认false
      swipable: { type: Boolean, default: false },
      // 开启循环,默认false
      loop: { type: Boolean, default: false },
      // 切换方式slide
      transitionType: { type: String, default: 'slide' }
    },
    // 扩展，默认false
    extra: Boolean
  },
  // 应用地址
  app_url: String,
  // 应用分类,节日、招聘、宣传
  app_type: Number,
  // 应用状态，是否发布
  app_status: { type: Number, default: 0 },
  // 是否上线或下线
  app_online: { type: Number, default: 0 },
  // 版本
  app_version: { type: Number, default: 0 },
  // 标签
  tags: Array,
  // 浏览次数
  viewcount: { type: Number, default: 0 },
  // 创建时间
  createtime: { type: Date, default: Date.now },
  // 修改时间
  updatetime: { type: Date, default: Date.now },
    // 应用使用模板的ID
  templateid: { type: Schema.Types.ObjectId, ref: 'Template' },
  // 创建者，一个APP对应一个用户
  creater: { type: Schema.Types.ObjectId, ref: 'Account' },
  // 页面列表，一个APP拥有多个pages
  pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }]
})

exports.AppsModel = mongoose.model('App', AppSchema)


