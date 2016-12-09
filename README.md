Infinite Scroll
===============

The Infinite Scroll module adds a jquery class that allows you to easily create infinitely scrolling pages.

##Setup
The infinite scroll library requires a few components to be set up. One on the server side and one on the client side. The server sides serves the appropriate data and the client side is the html market required for the infinite scroll.

###JS
    var myScroll = new InfiniteScroll({
      'bufferPx':200, // how many pixels from the bottom before loading the next page
      'captureScroll':true,
      'loaderLocation':$('.todays-tasks'), // where you want the loading animation to display
      'binder':$('.todays-tasks'), // where the 
      'appendLocation':$('.todays-tasks-append'), // where items will be appended
      'appendCallback':function(t) {
        // fix dates
        t.starts_at = t.starts_at === '0000-00-00 00:00:00' ? null : strtodate(t.starts_at);
        t.ends_at = t.ends_at === '0000-00-00 00:00:00' ? null : strtodate(t.ends_at);
        t.created_at = t.created_at === '0000-00-00 00:00:00' ? null : strtodate(t.created_at);
        // append task
        rc.append_task($('.todays-tasks-append'),t);
      },
      'loading':{
        'url':'/!/rapport_core/pager_todays_tasks',
        'options':{
          'numItems':10
        }
      }
    });