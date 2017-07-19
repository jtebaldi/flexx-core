$( document ).ready(function() {
  var topMenu = $(".top-menu-secondary");
      stickyDiv = "sticky";
      mobileMenu = $('.menu-mobile');
      
  if (topMenu.length) {
    extraPadding = topMenu.height();
    topMenu.next().css("padding-top", extraPadding);
  }
      
  $(window).bind("resize", function () {
    console.log($('.all-wrapper').width());
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
});