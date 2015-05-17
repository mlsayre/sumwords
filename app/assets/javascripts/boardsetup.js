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
        ui.draggable.draggable('option','revert',true);
    }
});
  $(".boardsquare").droppable({
    greedy: true,
    tolerance: "fit"
  });
  $(".tileholder").droppable({
    greedy: true,
    tolerance: "fit"
  });
})
