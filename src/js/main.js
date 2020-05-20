var burger = document.querySelector('.burger');
var mobileMenu = document.querySelector('.mobile-menu');

burger.addEventListener('click', function () {
	mobileMenu.classList.toggle('active');
	this.classList.toggle('active');
})

window.addEventListener('scroll', function () {
	mobileMenu.classList.remove('active');
	burger.classList.remove('active');
});