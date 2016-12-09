function InfiniteScroll(options) {
  var self = this;
  if (!InfiniteScroll.id) {
    InfiniteScroll.id = 1;
  } else {
    InfiniteScroll.id ++;
  }
  self.id = InfiniteScroll.id;

  function __init(options) {
    // default options
    self.defaults = {
      'appendLocation':$('#infinite-scroll-append'),
      'pixelsFromAppendLocationToBottom':0,
      'bufferPx':200,
      'binder':window,
      'captureScroll':false,
      'appendCallback':null,
      'loading':{
        'url':'/!/extension/api/',
        'options':{
          'numItems':15
        },
        'loader': null,
        'loaderLocation': null
      },
      'state':{
        'isDone':false,
        'currPage':1,
        'isPaused':false,
        'isBeyondMaxPage':false,
        'isInvalid':false,
        'isDuringAjax':false,
        'isDestroyed':false
      }
    };

    // extend default options
    var opts = $.extend(true, {}, self.defaults, options);
    if (opts.loaderLocation == null) {
      opts.loaderLocation = opts.appendLocation;
    }
    if ($.isWindow(opts.binder)) {
      opts.binder = $(opts.binder);
      opts.pixelsFromAppendLocationToBottom = 0 + $(document).height() - (opts.appendLocation.offset().top + opts.appendLocation.height());
    } else {
      opts.pixelsFromAppendLocationToBottom = 0 + $(opts.binder.find('.scroll-document:first')).outerHeight() - (opts.binder.offset().top - opts.appendLocation.offset().top + opts.appendLocation.outerHeight());
    }
    opts.loading.loader = global.loader.spawn(opts.loaderLocation);
    opts.loading.loader.blocking(false); // hide the overlay
    self.options = opts;
    
    self.options.binder.addClass('infinite-scroll-container');

    var binderHeight = self.options.binder.height()
      , binderScrollHeight = self.options.binder.get(0).scrollHeight;

    // prevent the window from scrolling when we hit the top or bottom
    if (self.options.captureScroll) {
      self.options.binder.hover(function(e) {
        $('body').addClass('infinite-scroll-lock');
        // document.body.style.overflow='hidden';
      }, function(e) {
         // document.body.style.overflow='auto';
         $('body').removeClass('infinite-scroll-lock');
      });
    }

    // bind on scroll
    (self.options.binder).bind('scroll', function() {
      self.scroll();
    });

    // retrieve the first page of results
    self.retrieve(self.options.state.currPage);
  }

  // Check to see if the next page is needed
  self.scroll = function() {
    var opts = self.options;
    state = opts.state;
    if (state.isDuringAjax || state.isDone || state.isInvalid || state.isDestroyed || state.isPaused || state.isBeyondMaxPage) {
      return;
    }
    if (!self._nearbottom()) {
      return;
    }
    opts.state.currPage++;
    self.retrieve(opts.state.currPage);
  }

  self.retrieve = function(pageNum) {
    pageNum = pageNum || null;
    var opts = self.options;

    // we don't want to fire ajax mutliple times.
    opts.state.isDuringAjax = true;
    opts.loading.loader.start();

    // prepare url
    var url = opts.loading.url;
    if (Object.keys(opts.loading.options).length > 0) {
      $.each(opts.loading.options, function(key, value) {
        url = parameterizeUrl(url, key, value);
      });
    }
    url = parameterizeUrl(url, 'page', pageNum);

    // fetch reults
    $.get(url, function(response) {
      if (response.status=='success') {
        for (var i=0; i<Object.keys(response.values).length; i++) {
          opts.appendCallback(response.values[i]);
          // reposition the loader
          opts.loading.loader.resize();
        };
      } else if (response.status=='empty') {
        opts.state.isBeyondMaxPage = true;
      } else {
        console.debug(url);
        console.debug(response);
      }
      opts.loading.loader.stop();
      self.options.state.isDuringAjax = false;
    });
  }

  self._nearbottom = function() {
    var opts = self.options,
        pixelsFromBinderBottomToBottom;
    if (opts.binder === $(window)) {
      pixelsFromBinderBottomToBottom = 0 + $(document).height()  - (opts.binder.scrollTop()) - $(window).height();
    } else {
      pixelsFromBinderBottomToBottom = 0 + $(opts.binder.find('.scroll-document:first')).outerHeight() + $(opts.binder.firstChild).height() - opts.binder.scrollTop() - $(opts.binder).height();
    }
    // if distance remaining in the scroll (including buffer) is less than the orignal appendLocation to bottom...
    return (pixelsFromBinderBottomToBottom - opts.bufferPx < opts.pixelsFromAppendLocationToBottom);
  };

  // Initialize the instance
  __init(options);
}