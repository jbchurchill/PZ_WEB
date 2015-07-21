$(function() { 
	
	$('.hassubnav').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('active');
		$(this).next('.subnav').slideDown();
	});
	
	$('.hassubnav').on('mouseenter', function(e) {
		$(this).addClass('active');
		$(this).next('.subnav').slideDown();
	}).on('mouseleave', function(e) {
		setTimeout(function() { 
			if(!$('.subnav').is(':hover')) {
				$('.nav.active').removeClass('active');
				$('.subnav').slideUp();
			}
		}, 250);
		
	});
	
	$('.subnav').on('mouseleave', function(e) { 
		$('.nav.active').removeClass('active');
		$(this).slideUp();
	});


	$(window).on('resize', function(){
		gcgovResize();
	});
	
	gcgovResize();
	
	
	$('.modalClose').on('click', function(e) {
		$('.modal').fadeOut(function(){
			$(this).remove();
		});	
	});
});


function gcgovResize() {
	$('#body-container').height( $(window).height() - $('#header').outerHeight() );
}