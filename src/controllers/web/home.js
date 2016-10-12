module.exports = async (ctx, next) => {
  const title = '首页'
  await ctx.render('index', {
    title
  })
}
