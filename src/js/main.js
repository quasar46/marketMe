document.addEventListener('DOMContentLoaded', function () {
	// mobile menu
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
});

function on() {
	document.getElementById("overlay").style.display = "block";
}

$(document).ready(function () {
	// slider index
	$('.slick-slider').slick({
		slidesToShow: 1,
		dots: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	})
	// slider produv
	$('.slick-slider2').slick({
		slidesToShow: 1,
		dots: false,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	})
});

// popup
$(document).ready(function () {

	// Initialize the plugin
	$('#popup1').popup({
		pagecontainer: '#page',
		escape: true,
		color: '#223983',
	});


	$('#closebutton').popup({
		closebutton: true
	});

	// Set default `pagecontainer` for all popups (optional, but recommended for screen readers and iOS*)
	$.fn.popup.defaults.pagecontainer = '#page'
});


// // video
// $('#mediaplayer').mediaelementplayer({
// 	pluginPath: "/path/to/shims/",
// 	// When using jQuery's `mediaelementplayer`, an `instance` argument
// 	// is available in the `success` callback
// 	success: function (mediaElement, originalNode, instance) {
// 		// do things
// 	}
// });
