require.config({
  paths: {
    jquery: 'components/jquery/jquery'
  }
});
require(['draggers', 'jquery'], function (Dragger, $) {

  $('#toolbox .proto').each(function(i, proto) {
    Dragger(proto);
  });

});