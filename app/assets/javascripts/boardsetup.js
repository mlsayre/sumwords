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
        if ($(this).find("span") == "DL") {
          $(ui.draggable + " span").text("HI")
        }
        console.log(ui.draggable)

      }
      var stockpoints = parseInt(ui.helper.context.attributes[2].value);
      if ($(this).text() == "DL") {
        var multiplier = 2;
        ui.draggable.find("p").addClass("cornerpointsdl");
      } else if ($(this).text() == "TL") {
        var multiplier = 3;
        ui.draggable.find("p").addClass("cornerpointstl");
      } else {
        var multiplier = 1;
        ui.draggable.find("p").removeClass("cornerpointsdl").removeClass("cornerpointstl")
      }
      function updatepointcorners() {
        $(".boardsquare").each(function() {
          var boardsquareid = $(this).attr("id");
          var neighborR = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) + 1).toString());
          var neighborL = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) - 1).toString());
          var neighborT = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) - 1).toString()) + boardsquareid.substring(2,5);
          var neighborB = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) + 1).toString()) + boardsquareid.substring(2,5);
          if ((($("#" + neighborR).attr("data-placedletter") != "none") ||
             ($("#" + neighborL).attr("data-placedletter") != "none")) &&
             (($("#" + neighborT).attr("data-placedletter") != "none") ||
             ($("#" + neighborB).attr("data-placedletter") != "none"))) {
            var twowaymultiplier = 2
          } else {
            var twowaymultiplier = 1
          }
          var modpoints = stockpoints * (multiplier * twowaymultiplier);
          ui.draggable.find("p").text(modpoints);
        })
      }
      updatepointcorners();
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
