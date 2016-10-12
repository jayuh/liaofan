module.exports = async (ctx, next) => {
  const title = '详情页'
  await ctx.render('index', {
    title
  })
}
