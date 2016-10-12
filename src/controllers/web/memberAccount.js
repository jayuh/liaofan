module.exports = async (ctx, next) => {
  const title = '个人信息'
  await ctx.render('index', {
    title
  })
}
