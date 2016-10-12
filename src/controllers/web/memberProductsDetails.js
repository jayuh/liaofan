module.exports = async (ctx, next) => {
  const title = '已购买商品详情'
  await ctx.render('index', {
    title
  })
}
