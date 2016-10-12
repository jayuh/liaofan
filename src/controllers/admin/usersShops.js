module.exports = async (ctx, next) => {
  const title = '商家用户 - 后管系统'
  await ctx.render('index', {
    title
  })
}
