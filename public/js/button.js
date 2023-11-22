$(document).ready(function(){
  $(".button_plus").mouseenter(function() {
    $(".dropdown").show();
  });

  $(".button_plus").mouseleave(function() {
    $(".dropdown").hide();
  });
});
