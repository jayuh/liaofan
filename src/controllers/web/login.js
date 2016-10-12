module.exports = async (ctx, next) => {
  const title = '登录、注册'
  await ctx.render('index', {
    title
  })
}
