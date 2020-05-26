let message = {};
message.error = function (msg) {
  var content = {};
  content.message = msg;
  content.icon = 'icon la la-warning';
  $.notify(content, { 
      type: 'danger',
      allow_dismiss: true,
      newest_on_top: false,
      mouse_over:  false,
      showProgressbar:  false,
      spacing: 10,
      timer: 3000,
      placement: {
          from: 'top', 
          align: 'right'
      },
      offset: {
          x: '30', 
          y: '30'
      },
      delay: 1000,
      z_index: 10000,
      animate: {
          enter: 'animated bounce',
          exit: 'animated bounce'
      }
  });
}

message.info = function (msg) {
    var content = {};
    content.message = msg;
    $.notify(content, { 
        type: 'info',
        allow_dismiss: true,
        newest_on_top: false,
        mouse_over:  false,
        showProgressbar:  false,
        spacing: 10,
        timer: 5000,
        placement: {
            from: 'top', 
            align: 'right'
        },
        offset: {
            x: '30', 
            y: '30'
        },
        delay: 1000,
        z_index: 10000,
        animate: {
            enter: 'animated bounce',
            exit: 'animated bounce'
        }
    });
}

message.success = function (msg) {
    var content = {};
    content.message = msg;
    content.icon = 'icon la la-check';
    $.notify(content, { 
        type: 'success',
        allow_dismiss: true,
        newest_on_top: false,
        mouse_over:  false,
        showProgressbar:  false,
        spacing: 10,
        timer: 3000,
        placement: {
            from: 'top', 
            align: 'right'
        },
        offset: {
            x: '30', 
            y: '30'
        },
        delay: 1000,
        z_index: 10000,
        animate: {
            enter: 'animated bounce',
            exit: 'animated bounce'
        }
    });
}