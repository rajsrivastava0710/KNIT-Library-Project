let hamburgerIcon = $('span.hamburger-icon');
let collapsedNavbar = $('.collapsed-navbar');

hamburgerIcon.on('click',function(){
	collapsedNavbar.toggleClass('show');
})

window.addEventListener('resize',function(){
	if(window.innerWidth>700){
	collapsedNavbar.removeClass('show');		
	}
})