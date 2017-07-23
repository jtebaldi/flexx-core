$( document ).ready(function() {
  var topMenu = $(".top-menu-secondary");
      stickyDiv = "sticky";
      mobileMenu = $('.menu-mobile');
      topMenuDisplay = topMenu.css('display');
      
  if ((topMenu.length) && (topMenuDisplay != 'none')) {
    extraPadding = topMenu.height();
    topMenu.next().css("padding-top", extraPadding);
  }
      
  $(window).bind("resize", function () {
    containerWidth = ($('.all-wrapper').width()) - ($('.desktop-menu').width());
    
    if ($(this).width() > 767) {
      topMenu.addClass(stickyDiv).css("width",containerWidth);
      
      mobileMenuHeight = 0;
    } else {
      topMenu.removeClass(stickyDiv).css("width", "inherit");
      mobileMenuHeight = mobileMenu.height();
      
      $(window).scroll(function() {
        if( $(this).scrollTop() > mobileMenuHeight ) {
          topMenu.addClass(stickyDiv);
        } else {
          topMenu.removeClass(stickyDiv);
        }
      });
    }
  }).trigger('resize');
  
  
  // Showing span helpers on side menu hover
  $(".menu-side-compact-w ul.main-menu").hover(function() {
    $(this).toggleClass("show-helpers");
  });
  
  // Add content-panel if present
  var elementExists = document.getElementById("side-panel");

  if (elementExists) {
    $(".all-wrapper").addClass("with-side-panel");
  }
  
  // Make alerts disappear
  $(".flash_messages .alert").delay(200).fadeOut(3500);
  

  $(".nav a").on("click", function(e){
    $(".nav").find(".current").removeClass("current");
    $(this).closest('li').addClass("current");
  });
  
});
