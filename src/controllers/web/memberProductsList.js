module.exports = async (ctx, next) => {
  const title = '已购买商品列表'
  await ctx.render('index', {
    title
  })
}
