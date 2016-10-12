$(function(){
	$('.ul_list2 > li > a').click(function() {
		$(this).addClass('sel').parent('li').siblings().children('a').removeClass('sel');
		$(this).parent('li').children('ul').slideDown();
		$(this).parent('li').siblings().children('ul').slideUp();
		$(this).siblings().children('li').eq(0).children('a').addClass('sel');
	});

	$('.ul_list2 > li > ul > li > a').click(function() {
		$('.ul_list2 > li > ul > li > a').removeClass('sel');
		$(this).addClass('sel').closest('li.firstLi').children('a').addClass('sel');
		$(this).closest('li.firstLi').siblings().children('a').removeClass('sel');
	});
})
