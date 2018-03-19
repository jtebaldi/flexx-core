/*

Main javascript functions to init most of the elements

#1. TESTIMONIALS
#2. PROJECTS SLIDER

*/

$(function(){

  // #1. TESTIMONIALS
  $('.testimonials-slider').slick({
    infinite: true,
    variableWidth: true,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: false,
      }
    }],
  });

  // #2. PROJECTS SLIDER
  $('.projects-slider-i').slick({
    infinite: true,
    variableWidth: true,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: false,
      }
    }],
  });

  $('.main-menu li a').on('click', function(){
    $('.main-menu li.active').removeClass('active');
    $(this).closest('li').addClass('active');
  });

  $('.mobile-menu-trigger').on('click', function(){
    $('.mobile-menu-holder').slideToggle(400);
  });

});
