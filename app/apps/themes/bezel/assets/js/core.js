(function($) {
  'use strict';
  var MAIN = {};
  MAIN.guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4();
  };

  MAIN.hexToRGBA = function(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return;
    }
    var colorObj = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: alpha || 1,
    };
    return 'rgba(' + colorObj.r + ', ' + colorObj.g + ', ' + colorObj.b + ', ' + colorObj.a + ')';
  };

  // Caching Selectors
  var $body = $('body');
  var $window = $(window);
  var $document = $(document);
  var $navBar = $('#navbar');
  var $asideNav = $('#aside-nav');
  var $homeSlider = $('#home-slider');
  var $searchModal = $('#search-modal');
  var $worksGrid = $('#works-grid');
  var $firstSection = $('section:first');

  function initLoad() {
    $window.on('load', function() {
      $('#loader').delay(500).fadeOut();
      $('#mask').delay(1000).fadeOut('slow');

      $worksGrid
        .isotope({
          itemSelector: '.work-item',
          masonry: {
            columnWidth: 0,
          },
        })
        .on('layoutComplete', function(event) {
          $window.trigger('resize');
        });

      $('.photo-gallery.masonry-style').justifiedGallery({
        rowHeight: 300,
        margins: 10,
      });

      var portfolioFilters = $('#filters');

      portfolioFilters.on('click', 'li', function() {
        portfolioFilters.find('li').removeClass('active');
        $(this).addClass('active');
        var filterValue = $(this).attr('data-filter');
        $worksGrid.isotope({ filter: filterValue });
        $window.trigger('resize');
      });

      $('#fullpage').fullpage({
        sectionSelector: 'section',
        menu: '#menu',
        lockAnchors: true,
        navigation: true,
        navigationPosition: 'right',
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: 'bottom',
        responsiveWidth: 768,
      });
    });
  }

  function fixNavigationColor() {
    var currentSlide = $homeSlider.find('.slick-current .slide-wrap');
    if (
      $(currentSlide).hasClass('no-overlay') ||
      $(currentSlide).hasClass('white-overlay') ||
      $(currentSlide).hasClass('light-overlay')
    ) {
      $body.addClass('light-slide');
    } else {
      $body.removeClass('light-slide');
    }
  }

  function initHomeSlider() {
    $homeSlider.parent('section').addClass('home-section');

    var animateContent = function() {
      var delay = 100;
      var currentSlide = $homeSlider.find('.slick-current');

      if ($(currentSlide).find('.slide-wrap').hasClass('light')) {
        $body.addClass('light-slide');
      } else {
        $body.removeClass('light-slide');
      }

      $homeSlider.find('.slick-current .slide-content > .container').children().each(function() {
        var $content = $(this);
        setTimeout(
          function() {
            $content.css({
              opacity: 1,
              '-webkit-transform': 'scale(1)',
              '-moz-transform': 'scale(1)',
              transform: 'scale(1)',
            });
          },
          delay
        );

        delay += 400;
      });
    };

    $homeSlider.closest('section').addClass('p-0').append('<div class="slide-arrows"></div>');

    $homeSlider.find('.slide-item>img').each(function(index, el) {
      var slide = $(el).parent('.slide-item');
      var image = $(el).attr('src');
      var template = '<div class="row-parallax-bg">';
      template += '<div class="parallax-wrapper">';
      template += '<div class="parallax-bg" style="background-image: url(' + image + ')">';
      template += '</div></div></div>';

      if ($homeSlider.data('disable-parallax')) {
        template = '<div class="slide-image" style="background-image: url(' + image + ')"></div>';
      }

      $(slide).prepend(template);
      $(el).remove();
    });

    $homeSlider.on('init', function(event) {
      $('.slide-arrows').appendTo($homeSlider);
      animateContent();
      fixNavigationColor();
      if (navigator.userAgent.indexOf('Firefox') === -1) {
        $('.slick-slide').addClass('image-scaling');
      }
      var vid = $homeSlider.find('.slick-current video');
      if (vid.length > 0) {
        $(vid).get(0).play();
      }
    });

    $homeSlider
      .slick({
        autoplay: true,
        autoplaySpeed: 7000,
        prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
        slickFilter: '.slide-arrows',
        appendArrows: $('.slide-arrows'),
        dots: true,
        dotsClass: 'slide-dots',
      })
      .on('beforeChange', function(event, slick, currentSlide) {
        $homeSlider.find('.slick-current .slide-content > .container').children().each(function() {
          var $content = $(this);
          $content.css({
            opacity: 0,
            '-webkit-transform': 'scale(.9)',
            '-moz-transform': 'scale(.9)',
            transform: 'scale(.9)',
          });
        });
      })
      .on('afterChange', function(event) {
        animateContent();
        fixNavigationColor();
      });
  }

  function initParallax() {
    $('.parallax-bg img').each(function(index, el) {
      var container = $(this).parent('.parallax-bg');
      var image = $(this).attr('src');

      $(container).css('background-image', 'url(' + image + ')');

      $(this).remove();
    });

    $('.parallax-wrapper').each(function(index, el) {
      var elOffset = $(el).parent().offset().top;
      var winTop = $window.scrollTop();
      var scrll = (winTop - elOffset) * 0.15;

      if ($(el).isOnScreen()) {
        $(el).css('transform', 'translate3d(0, ' + scrll + 'px, 0)');
      }
    });
  }

  function initNavbar() {
    if (
      !$firstSection.is('.parallax-section, .dark-bg, .colored-bg') &&
      $homeSlider.length === 0
    ) {
      $navBar.addClass('stick');
    }

    if ($firstSection.is('.parallax-section.text-dark')) {
      $body.addClass('light-slide');
    }

    $navBar.find('.navigation-menu>li').slice(-2).addClass('last-elements');

    $('.menu-toggle, .toggle-nav').on('click', function(event) {
      event.preventDefault();
      if ($window.width() < 992) {
        $(this).find('.hamburger').toggleClass('is-active');

        $('#navigation').slideToggle(400);
        $navBar.find('.cart-open').removeClass('opened');
      }
    });

    $.merge($navBar, $asideNav).on('click', '.navigation-menu li.menu-item-has-children>a', function(e) {
      if ($window.width() < 992) {
        e.preventDefault();
        $(this).parent('li').toggleClass('opened').find('.submenu:first').slideToggle();
      }
    });

    $('#navigation .navigation-menu a[data-scroll="true"]').on('click', function() {
      if ($window.width() < 992) {
        $('.menu-toggle').trigger('click');
      }
    });

    $body.scrollspy({
      target: '#navigation',
    });

    $navBar.on('click', '.cart-open>a', function(event) {
      if ($window.width() < 992) {
        event.preventDefault();
        event.stopPropagation();

        if ($('#navigation').is(':visible')) {
          $('.menu-toggle').trigger('click');
        }

        $(this).parent('.cart-open').toggleClass('opened');
      }
    });
  }

  function initScroll() {
    $window
      .on('scroll', function() {
        if (
          $firstSection.is('.parallax-section, .dark-bg, .home-section, .colored-bg, .gradient-bg') ||
          $homeSlider.length
        ) {
          if ($window.width() > 991) {
            if ($window.scrollTop() >= 150) {
              $navBar.addClass('stick');
            } else {
              $navBar.removeClass('stick');
            }

            if ($firstSection.hasClass('section-bordered')) {
              if ($window.scrollTop() <= 20) {
                $body.addClass('top-spacing');
              } else {
                $body.removeClass('top-spacing');
              }
            }
          }
        }

        initParallax();
      })
      .trigger('scroll');
  }

  function initVivus() {
    $('.animated-icon').each(function(index, el) {
      var startAt = $(el).parents('[data-animation]').length ? 'manual' : 'inViewport';
      if ($(el).parents('#fullpage').length) {
        startAt = 'autostart';
      }
      var delay = ($(el).parents('[data-animation]').length && $window.width() > 767)
        ? $(el).parents('[data-animation]').data('delay')
        : 0;
      new Vivus(el, {
        file: $(el).data('icon'),
        start: startAt,
        onReady: function(obj) {
          if ($(el).hasClass('gradient-icon')) {
            var colors = $(el).data('gradients')
              ? $(el).data('gradients').replace(' ', '').split(',')
              : ['#cf93ff', '#00c3da'];
            var xmlns = 'http://www.w3.org/2000/svg';
            var grad = document.createElementNS(xmlns, 'linearGradient');
            var uid = 'grad-' + MAIN.guid(6);
            grad.setAttributeNS(null, 'id', uid);
            grad.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');

            var stop1 = document.createElementNS(xmlns, 'stop');
            stop1.setAttributeNS(null, 'offset', 0);
            stop1.setAttributeNS(null, 'stop-color', colors[0]);

            var stop2 = document.createElementNS(xmlns, 'stop');
            stop2.setAttributeNS(null, 'offset', 100);
            stop2.setAttributeNS(null, 'stop-color', colors[1]);

            grad.append(stop1, stop2);

            $(obj.el).prepend(grad);
            obj.el.setAttributeNS(null, 'stroke', 'url(#' + uid + ')');
            $(obj.map).each(function(index, item) {
              item.el.setAttributeNS(null, 'stroke', 'url(#' + uid + ')');
            });
          }

          if ($(el).data('custom-color')) {
            var customColor = $(el).data('custom-color');
            obj.el.setAttributeNS(null, 'stroke', customColor);
            $(obj.map).each(function(index, item) {
              item.el.setAttributeNS(null, 'stroke', customColor);
            });
          }

          if ($(el).parents('[data-animation]')) {
            $(el).parents('[data-animation]').appear(function() {
              setTimeout(
                function() {
                  obj.play();
                },
                delay
              );
            });
          }
        },
      });
    });
  }

  function initGeneral() {
    $('a[data-scroll="true"]').on('click', function() {
      if (
        location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
        location.hostname === this.hostname
      ) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate(
            {
              scrollTop: target.offset().top,
            },
            1000
          );
          return false;
        }
      }
    });

    $('<div class="footer-spacer"></div>').insertAfter('#footer');

    $('.open-search-form').on('click', function(e) {
      e.preventDefault();
      $searchModal.addClass('active');
      $body.addClass('modal-open');
      $navBar.find('.cart-open').removeClass('opened');
      setTimeout(
        function() {
          $('.search-form .form-control').focus();
        },
        500
      );
    });

    $('#close-search-modal').on('click', function(e) {
      e.preventDefault();
      $searchModal.removeClass('active');
      $body.removeClass('modal-open');
    });

    $window
      .on('resize', function() {
        $('.footer-spacer').css('height', $('#footer').height());
      })
      .trigger('resize');

    $('.bg-img, .thumb-placeholder, #navbar .product-list .product-thumbnail>img').each(function(index, el) {
      var image = $(el).attr('src');
      $(el).parent().css('background-image', 'url(' + image + ')').addClass('img-cover');

      if ($(el).parent().hasClass('card-post-wrapper')) {
        $(el).parent().addClass('dark-bg');
      }

      $(el).remove();
    });

    $('.typed-words').each(function(index, el) {
      $(el).typed({
        strings: $(el).data('strings'),
        startDelay: 0,
        typeSpeed: 0,
        backDelay: 1500,
        backSpeed: 0,
        loop: true,
      });
    });

    if ($('#footer').length) {
      $('#wrapper>section:last').addClass('last-section');
    }

    $('.progress-bar').appear(function() {
      $(this).css('width', $(this).data('progress') + '%');
      $(this)
        .parents('.skill')
        .find('.skill-perc')
        .css('right', 100 - $(this).data('progress') + '%');
    });

    $('.testimonials-slider').slick({
      dots: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
    });

    $('[data-gradients]').not('.animated-icon').each(function(index, el) {
      var colors = $(el).data('gradients').replace(' ', '').split(',');
      $(el).prepend(
        '<div class="gradient-bg-wrapper"><div class="gradient-bg-element"></div></div>'
      );
      $(el)
        .find('.gradient-bg-element')
        .css('background', 'linear-gradient(90deg, ' + colors[0] + ' 0%, ' + colors[1] + ' 100%)');
    });

    $('[data-custom-bg]').each(function(index, el) {
      var bgColor;
      if ($(el).hasClass('team-overlay')) {
        bgColor = $(el).data('custom-bg');
        $(el).css('background-color', MAIN.hexToRGBA(bgColor, 0.90));
      } else if (
        $(el).data('bg-opacity') || $(el).hasClass('slide-wrap') || $(el).hasClass('image-overlay')
      ) {
        bgColor = $(el).data('custom-bg');
        var bgOpacity = $(el).data('bg-opacity') || 0.5;
        $(el).css('background-color', MAIN.hexToRGBA(bgColor, bgOpacity));
      } else {
        $(el).css('background-color', $(el).data('custom-bg'));
      }
    });

    $('[data-custom-color]').each(function(index, el) {
      if (!$(el).hasClass('animated-icon')) {
        $(el).css('color', $(el).data('custom-color'));
      }
    });

    $('[data-negative-margin]').each(function(index, el) {
      $(el).css('margin-top', -$(el).data('negative-margin'));
    });

    $('.product-rating-stars').each(function(index, el) {
      $(el).css('width', $(el).data('width') + '%');
    });

    $('.section-skewed').each(function(index, el) {
      $(el).append('<div class="skewed-mask"><div class="mask-block"></div></div>');
      var bgColor;
      if ($(el).next('section').data('gradients')) {
        bgColor = $(el).next('section').find('.gradient-bg-element').css('background');
        $(el).find('.skewed-mask .mask-block').css('background', bgColor);
      } else {
        bgColor = $(el).next('section').css('background') ||
          $(el).next('section').css('backgroundColor');
        $(el).find('.skewed-mask .mask-block').css('background', bgColor);
      }
    });

    $('.counter').appear(function() {
      var counter = $(this).find('.number-count');
      var toCount = counter.data('count');
      var delay = $(this).data('delay') || 0;

      setTimeout(
        function() {
          $(counter).countTo({
            from: 0,
            to: toCount,
            speed: 1000,
            refreshInterval: 50,
          });
        },
        delay
      );
    });

    $('.toggle-nav').on('click', function(event) {
      if ($window.width() > 991) {
        $(this).find('.hamburger').toggleClass('is-active');
        $asideNav.toggleClass('is-active');
      }
    });

    $('.toggle-fs-menu').on('click', function(event) {
      $body.toggleClass('modal-open');
      $(this).toggleClass('menu-active');
      $(this).find('.hamburger').toggleClass('is-active');
      $(this).parents('.fs-menu-wrapper').find('.fullscreen-menu').toggleClass('is-active');
    });

    $('.fs-menu-wrapper')
      .on('click', '.navigation-menu >li.menu-item-has-children>a', function(e) {
        e.preventDefault();
        $('.navigation-menu>li').not($(this).parent('li')).find('.submenu').slideUp(300);
        $(this).parent('li').find('ul:first').slideToggle(300);
      })
      .on(
        'click',
        '.submenu>li.menu-item-has-children>a, .sub-menu>li.menu-item-has-children>a',
        function(e) {
          e.preventDefault();
          $('.navigation-menu .submenu>li').not($(this).parent('li')).find('.submenu').slideUp(300);
          $('.navigation-menu .submenu>li')
            .not($(this).parent('li'))
            .find('.sub-menu')
            .slideUp(300);
          $(this).parent('li').find('ul:first').slideToggle(300);
        }
      );

    $asideNav
      .on('click', '.navigation-menu >li.menu-item-has-children>a', function(e) {
        if ($window.width() > 991) {
          e.preventDefault();
          $('.navigation-menu>li').not($(this).parent('li')).find('.submenu').slideUp(300);
          $(this).parent('li').find('ul:first').slideToggle(300);
        }
      })
      .on(
        'click',
        '.submenu>li.menu-item-has-children>a, .sub-menu>li.menu-item-has-children>a',
        function(e) {
          if ($window.width() > 991) {
            e.preventDefault();
            $('.navigation-menu .submenu>li')
              .not($(this).parent('li'))
              .find('.submenu')
              .slideUp(300);
            $('.navigation-menu .submenu>li')
              .not($(this).parent('li'))
              .find('.sub-menu')
              .slideUp(300);
            $(this).parent('li').find('ul:first').slideToggle(300);
          }
        }
      );

    $('#particle-canvas').particleground({
      dotColor: $('#particle-canvas').data('dot-color') || '#fff',
      lineColor: $('#particle-canvas').data('line-color') || 'transparent',
      lineWidth: 1,
      particleRadius: 3,
      density: 6000,
    });
  }

  function initAnimation() {
    $('[data-animation]').addClass('animated');
    if ($worksGrid.hasClass('enable-animation')) {
      $worksGrid.find('.work-item').addClass('animated');

      $worksGrid.appear(function() {
        var dataDelay = 0;
        var animationName = $(this).data('animation-name') || 'fadeInUp';
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        $(this).find('.work-item').each(function(index, el) {
          setTimeout(
            function() {
              $(el).addClass(animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
              });
            },
            dataDelay
          );
          dataDelay += 200;
        });
      });
    }

    $('[data-animation]').each(function(index, el) {
      var delay = $(el).data('delay') || 0;
      if ($window.width() < 768) {
        delay = 0;
      }
      $(el).appear(
        function() {
          setTimeout(
            function() {
              $(el).addClass($(el).data('animation'));
            },
            delay
          );
        },
        { accX: 0, accY: 0 }
      );
    });
  }

  function initAccordions() {
    $('.accordion').each(function(index, el) {
      if ($(el).data('open-first')) {
        $(el).find('li:first').addClass('active');
        $(el).find('li:first .accordion-content').show();
      }
    });

    $('.accordion-title').on('click', function(event) {
      var accordion = $(this).parents('.accordion');

      if (!accordion.data('multiple')) {
        accordion.find('li').not($(this).parent()).removeClass('active');
        accordion.find('li').not($(this).parent()).find('.accordion-content').slideUp(300);
      }

      $(this).parent('li').toggleClass('active');
      $(this).next().slideToggle(300);
    });
  }

  function initSlick() {
    $('.carousel').each(function(index, el) {
      var dataOptions = $(this).data('slick') || {};
      if (dataOptions.slidesToShow === 1) {
        dataOptions.mdItems = dataOptions.mdItems || 1;
        dataOptions.smItems = dataOptions.smItems || 1;
        dataOptions.xsItems = dataOptions.xsItems || 1;
      }
      $(el).slick({
        autoplay: true,
        arrows: false,
        dots: true,
        swipeToSlide: true,
        infinite: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: dataOptions.mdItems || 3,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: dataOptions.smItems || 2,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: dataOptions.xsItems || 1,
            }
          },
        ],
      });
    });

    $('.images-gallery').not('#product-slider').slick({
      autoplay: true,
      arrows: true,
      dots: false,
      swipeToSlide: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
    });

    $('#product-slider-nav').slick({
      arrows: true,
      dots: false,
      infinite: true,
      touchMove: false,
      asNavFor: '#product-slider',
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 3,
      focusOnSelect: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-up"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-down"></i></button>',
      responsive: [
        {
          breakpoint: 767,
          settings: {
            vertical: false,
            slidesToShow: 3,
            prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
          }
        },
      ],
    });

    $('#product-slider').slick({
      arrows: true,
      dots: false,
      swipeToSlide: true,
      asNavFor: '#product-slider-nav',
      prevArrow: '<button type="button" class="slick-prev"><i class="hc-arrow-round-back"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="hc-arrow-round-forward"></i></button>',
    });
  }

  function initMap() {
    var lat = $('#map').data('lat');
    var long = $('#map').data('long');
    var mapTitle = $('#map').data('title') || '';

    var myLatlng = new google.maps.LatLng(lat, long);

    var defaultStyle = [
      {
        featureType: 'landscape',
        stylers: [
          { hue: '#FFBB00' },
          { saturation: 43.400000000000006 },
          { lightness: 37.599999999999994 },
          { gamma: 1 },
        ],
      },
      {
        featureType: 'road.highway',
        stylers: [
          { hue: '#FFC200' },
          { saturation: -61.8 },
          { lightness: 45.599999999999994 },
          { gamma: 1 },
        ],
      },
      {
        featureType: 'road.arterial',
        stylers: [
          { hue: '#FF0300' },
          { saturation: -100 },
          { lightness: 51.19999999999999 },
          { gamma: 1 },
        ],
      },
      {
        featureType: 'road.local',
        stylers: [{ hue: '#FF0300' }, { saturation: -100 }, { lightness: 52 }, { gamma: 1 }],
      },
      {
        featureType: 'water',
        stylers: [
          { hue: '#0078FF' },
          { saturation: -13.200000000000003 },
          { lightness: 2.4000000000000057 },
          { gamma: 1 },
        ],
      },
      {
        featureType: 'poi',
        stylers: [
          { hue: '#00FF6A' },
          { saturation: -1.0989010989011234 },
          { lightness: 11.200000000000017 },
          { gamma: 1 },
        ],
      },
    ];

    var greyStyle = [
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#d3d3d3' }] },
      { featureType: 'transit', stylers: [{ color: '#808080' }, { visibility: 'off' }] },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ visibility: 'on' }, { color: '#b3b3b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 1.8 }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d7d7d7' }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry.fill',
        stylers: [{ visibility: 'on' }, { color: '#ebebeb' }],
      },
      { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#a7a7a7' }] },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [{ visibility: 'on' }, { color: '#efefef' }],
      },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#696969' }] },
      {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'on' }, { color: '#737373' }],
      },
      { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d6d6d6' }],
      },
      { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      {},
      { featureType: 'poi', elementType: 'geometry.fill', stylers: [{ color: '#dadada' }] },
    ];

    var styles = $('#map').data('style') === 'grey' ? greyStyle : defaultStyle;

    var mapOptions = {
      zoom: 12,
      center: myLatlng,
      mapTypeControl: false,
      disableDefaultUI: true,
      zoomControl: true,
      scrollwheel: false,
      draggable: !('ontouchend' in document),
      styles: styles,
    };

    var map = new google.maps.Map($('#map').get(0), mapOptions);

    var infowindow = new google.maps.InfoWindow({
      content: '<h6>' + mapTitle + '</h6>',
    });

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon: './images/marker.svg',
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  function initVideos() {
    var $youtubePlayer = $('.video-player[data-property]');
    if ($youtubePlayer.length) {
      $youtubePlayer.each(function(index, el) {
        $(el).mb_YTPlayer({
          autoPlay: true,
          mute: true,
          containment: 'self',
          showControls: false,
        });
      });
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      $('.video-wrapper').each(function(index, el) {
        $(el).append('<div class="fallback-bg"></div>');
        $(el).find('.fallback-bg').css(
          'background-image',
          'url(' + $(el).data('fallback-bg') + ')'
        );
      });
    }

    var videoEl = $('.video-wrapper video');

    var setProportion = function() {
      var proportion = getProportion();
      videoEl.width(proportion * 1280);
      videoEl.height(proportion * 780);

      centerVideo();
    };

    var getProportion = function() {
      var windowWidth = $window.width();
      var windowHeight = $window.height();
      var windowProportion = windowWidth / windowHeight;
      var origProportion = 1280 / 720;
      var proportion = windowHeight / 720;

      if (windowProportion >= origProportion) {
        proportion = windowWidth / 1280;
      }

      return proportion;
    };

    var centerVideo = function() {
      var centerX = ($window.width() >> 1) - (videoEl.width() >> 1) | 0;
      var centerY = ($window.height() >> 1) - (videoEl.height() >> 1) | 0;

      videoEl.css({ left: centerX, top: centerY });
    };

    if (videoEl.length) {
      $window
        .on('resize', function() {
          setProportion();
        })
        .trigger('resize');
    }
  }

  function initPhotoGallery() {
    var imagesArray = [];

    $('.photo-gallery').on('click', '.gallery-item a', function(event) {
      event.preventDefault();

      var gallery = $(this).parents('.photo-gallery');
      var galleryElements = gallery.find('.gallery-item>a');

      for (var i = 0; i < galleryElements.length; i++) {
        imagesArray.push($(galleryElements[i]).attr('href'));
      }

      var image = $(this).attr('href');

      var template = '<div id="gallery-modal">';
      template += '<div class="lightbox-loader"></div>';

      template += '<div class="lightbox-gallery">';
      for (var x = 0; x < imagesArray.length; x++) {
        template += '<div class="single-gallery">';
        template += '<img data-lazy="' + imagesArray[x] + '" alt="">';
        template += '</div>';
      }
      template += '</div>';

      template += '<div class="gallery-controls">';
      template += '<a href="#" id="gallery-close"><i class="hc-close-circle"></i></a>';
      template += '<div class="gallery-control gallery-prev"><a href="#" class="slick-prev"><i class="hc-arrow-round-back"></i></a></div>';
      template += '<div class="gallery-control gallery-next"><a href="#" class="slick-next"><i class="hc-arrow-round-forward"></i></a></div>';
      template += '</div>';

      template += '</div>';

      $body.append(template).addClass('modal-open');
      $('#gallery-modal').fadeIn(300);

      var lightBox = $('.lightbox-gallery');

      lightBox.slick({
        accessibility: false,
        autoplay: true,
        autoplaySpeed: 5000,
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        initialSlide: imagesArray.indexOf(image),
      });

      lightBox.css('transform', 'translateY(0)');

      lightBox.on('beforeChange', function(event) {
        $('#gallery-modal .lightbox-loader').delay(500).fadeIn(200);
      });

      lightBox.on('lazyLoaded', function(event) {
        $('#gallery-modal .lightbox-loader').fadeOut(200);
      });
    });

    var hideLightbox = function() {
      event.preventDefault();
      $('#gallery-modal').fadeOut(300, function() {
        $('#gallery-modal').remove();
      });
      $body.removeClass('modal-open');
    };

    $body.on('click', '#gallery-close', function(event) {
      hideLightbox();
    });

    $body.on('click', '.lightbox-gallery img', function(event) {
      event.stopPropagation();
    });

    $body.on('click', '.gallery-control>a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var action = $(this).hasClass('slick-prev') ? 'slickPrev' : 'slickNext';
      $('.lightbox-gallery').slick(action);
    });

    $body.on('click', '#gallery-modal', function(event) {
      hideLightbox();
    });

    $document.on('keyup', function(e) {
      if (e.keyCode === 27) {
        hideLightbox();
      }
      if (e.keyCode === 37) {
        $('.lightbox-gallery').slick('slickPrev');
      }
      if (e.keyCode === 39) {
        $('.lightbox-gallery').slick('slickNext');
      }
    });
  }

  function initVideoModal() {
    $('a[data-play-button]').on('click', function(e) {
      e.preventDefault();
      var videoUrl = $(this).data('src') || $(this).attr('href');

      var template = '<div id="gallery-modal">';
      template += '<div class="gallery-controls">';
      template += '<a href="#" id="gallery-close"><i class="hc-close-circle"></i></a>';
      template += '</div>';

      template += '<div class="centrize">';
      template += '<div class="v-center">';

      template += '<div class="video-gallery">';
      template += '<div class="media-video">';
      template += '<iframe src="' + videoUrl + '" frameborder="0">';
      template += '</div>';
      template += '</div>';

      template += '</div>';
      template += '</div>';

      template += '</div>';

      $body.append(template);

      $body.addClass('modal-open');

      $('#gallery-modal').fadeIn(300);
    });
  }

  function initContactForm() {
    var requiredInputs = $('#contact-form').find('input[data-required], textarea[data-required]').toArray();

    var isValidForm = function() {
      var toReturn;

      requiredInputs.forEach(function(element, index) {
        if (!$(element).val()) {
          toReturn = false;
        } else {
          toReturn = true;
        }
      });

      return toReturn;
    }

    $('#contact-form').on('submit', function(event) {
      event.preventDefault();

      requiredInputs.forEach(function(element, index) {
        if (!$(element).val()) {
          $(element).parents('.form-group').addClass('has-error');
        } else {
          $(element).parents('.form-group').removeClass('has-error');
        }
      });

      if (isValidForm()) {
        $.ajax({
          url: $(this).attr('action'),
          type: 'POST',
          data: $(this).serialize(),
        })
        .done(function() {
          var message = $('#contact-form').data('success-text') || 'Your message has been sent. We will get back to you shortly!';
          var succesTemplate = '<div role="alert" class="alert alert-success alert-colored">' + message + '</div>';
          $('#contact-form input, #contact-form textarea, #contact-form button').attr('disabled', 'disabled');
          $('#contact-form .alert').fadeOut(300);
          $(succesTemplate).insertBefore($('#contact-form .btn'));
        })
        .fail(function() {
          var message = $('#contact-form').data('error-text') || 'There was an error. Try again later.';
          var errorTemplate = '<div role="alert" class="alert alert-danger alert-colored">' + message + '</div>';
          $('#contact-form .alert').fadeOut(300);
          $(errorTemplate).insertBefore($('#contact-form .btn'));
        })
      }
    });

    $('#contact-form input, #contact-form textarea').on('keyup', function(event) {
      event.preventDefault();
      if ($(this).val()) {
        $(this).parent('.form-group').removeClass('has-error');
      }
    });
  }

  function initCustom() {
    // Your code here.
  }

  function init() {
    $.fn.isOnScreen = function() {
      var viewport = {};
      viewport.top = $window.scrollTop();
      viewport.bottom = viewport.top + $window.height();
      var bounds = {};
      bounds.top = this.offset().top;
      bounds.bottom = bounds.top + this.outerHeight();
      return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
    };

    initGeneral();
    initContactForm();
    initVivus();
    initHomeSlider();
    initNavbar();
    initScroll();
    initLoad();
    initAnimation();
    initAccordions();
    initSlick();
    initPhotoGallery();
    initVideos();
    initVideoModal();
    initCustom();
    if ($('#map').length) {
      google.maps.event.addDomListener(window, 'load', initMap);
      $('#map').css('position', 'absolute');
    }
  }

  init();
})(jQuery);
