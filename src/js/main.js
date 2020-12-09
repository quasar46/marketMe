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

$(document).ready(function () {
	var Min = 660;//минуты
	var Min_value = 660;//минимум
	var Max_value = 1320;//максимум
	var Step = 30

	function setTime($input) {
		var hour = Math.floor(Min / 60);
		var min = Min % 60;

		if (min < 10) {
			min = '0' + min;
		}

		if (hour < 10) {
			hour = '0' + hour;
		}

		$input.val(hour + ':' + min);
	}

	$('.decrease').click(function () {
		if ((Min - Step) < Min_value) return;
		Min -= Step;
		if (Min <= 0) Min += 1440;
		setTime($(this).parent().find('input'));
	});

	$('.increase').click(function () {
		if ((Min + Step) > Max_value) return;
		Min += Step;
		if (Min >= 1440) Min -= 1440;
		setTime($(this).parent().find('input'));
	});
});

$(document).ready(function () {
	$('.modal-order__form-social a').on('click', function () {
		$(this).toggleClass('active');
	})
})

$(document).ready(function () {
	$('.header__phone--mobile').on('click', function () {
		$('#popup-mobile').toggleClass('active');
	})
	$('#popup-mobile .close').on('click', function () {
		$('#popup-mobile').removeClass('active');
	})
})

function checkParams() {
	var name = $('#input-name').val();
	var phone = $('#input-tel').val();

	if (name.length != 0 && phone.length != 0) {
		$('#input-submit').removeAttr('disabled');
	} else {
		$('#input-submit').attr('disabled', 'disabled');
	}
}

function checkParams2() {
	var name = $('#input-name').val();
	var phone = $('#input-tel').val();
	var sfera = $('#input-sfera').val();
	// var consent = $('#consent');

	if (name.length != 0 && phone.length != 0 && sfera.length != 0) {
		$('#input-submit').removeAttr('disabled');
	} else {
		$('#input-submit').attr('disabled', 'disabled');
	}
}