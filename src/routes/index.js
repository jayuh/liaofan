const Router = require('koa-router')
const controllers = require('../controllers')
const router = new Router()

router.get('/help', controllers.help)

/**
 * 前台
 */
// 列表页
router.get('/', controllers.web.home)
// 详情页
router.get('/details', controllers.web.details)
// 登录/注册
router.get('/login', controllers.web.login)
// 个人信息
router.get('/member/account', controllers.web.memberAccount)
// 已购买商品列表
router.get('/member/products/list', controllers.web.memberProductsList)
// 已购买商品详情
router.get('/member/products/details', controllers.web.memberProductsDetails)

/**
 * 后管系统
 */
// 登录/注册
router.get('/admin/login', controllers.admin.login)
// 普通用户
router.get('/admin/users/users', controllers.admin.usersUsers)
// 商家用户
router.get('/admin/users/shops', controllers.admin.usersShops)
// 商品列表
router.get('/admin/products/list', controllers.admin.productsList)
// 添加商品
router.get('/admin/products/add', controllers.admin.productsAdd)

/**
 * 商家系统
 */

/**
 * 接口
 */

module.exports = router
