module.exports = async (ctx, next) => {
  const title = '后管列表 - 后管系统'
  await ctx.render('admin/products/list', {
    title
  })
}
