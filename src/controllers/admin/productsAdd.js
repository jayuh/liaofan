module.exports = async (ctx, next) => {
  const title = '添加商品 - 后管系统'
  await ctx.render('index', {
    title
  })
}
