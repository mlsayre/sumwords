$(document).ready(function() {
  $(".dw").text("DW");
  $(".dl").text("DL");
  $(".tl").text("TL");

  $(".letter").draggable({
    snap: ".boardsquare, .tileholder",
    snapMode: "inner",
    zIndex: 100,
    opacity: 0.7,
    revert: "invalid",
    revertDuration: 300,
    containment: "window",
    stop: function(){
      $(this).draggable('option','revert','invalid');
    }
  });
  $('.letter').droppable({
    greedy: true,
    tolerance: 'touch',
    drop: function(event,ui){
      ui.draggable.draggable('option','revert', true);
    },

  });
  $(".boardsquare").droppable({
    greedy: true,
    tolerance: "fit",
    drop: function(event,ui){
      var letterAdd = ui.helper.context.attributes[1].value;
      if ($(this).attr("data-placedletter") == "none") {
        $(".boardsquare").each(function() {
          if ($(this).attr("data-placedletter") == letterAdd) {
            $(this).attr("data-placedletter", "none");
          }
        });
        $(this).attr("data-placedletter", letterAdd);
      }
      var origpoints = ui.helper.context.attributes[2].value;
      if ($(this).attr("data-placedletterpoints") == "none") {
        $(".boardsquare").each(function() {
          if ($(this).attr("data-placedletterpoints") == origpoints) {
            $(this).attr("data-placedletterpoints", "none");
          }
        });
        $(this).attr("data-placedletterpoints", origpoints);
      }
    },
    // out: function(event,ui){
    //   var letterAdd = ui.helper.context.attributes[1].value;
    //   $(this).removeAttr("data-placedletter");
    // }
  });
  $(".tileholder").droppable({
    greedy: true,
    tolerance: "fit"
  });
})
