$(document).ready(function() {
  var pointsforbingo = 30;
  var validwords = [];
  var badwords = [];
  var goodwords = [];
  var strayletter = false;
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
        // if ($(this).find("span") == "DL") {
        //   $(ui.draggable + " span").text("HI")
        // }

      }

      function updatepointcorners() {
        strayletter = false
        $(".boardsquare[data-placedletter!='none']").each(function() {
          var dataid = $(this).attr("data-placedletter");
          var stockpoints = parseInt($('.letter[data-letter=' + dataid + ']').attr("data-letterpointsoriginal"));
          var boardsquareid = $(this).attr("id");
          if ($("#" + boardsquareid).text() == "DL") {
            var multiplier = 2;
            $('.letter[data-letter=' + dataid + '] p').addClass("cornerpointsdl");
          } else if ($("#" + boardsquareid).text() == "TL") {
            var multiplier = 3;
            $('.letter[data-letter=' + dataid + '] p').addClass("cornerpointstl");
          } else {
            var multiplier = 1;
            $('.letter[data-letter=' + dataid + '] p').removeClass("cornerpointsdl").removeClass("cornerpointstl")
          }
          var neighborR = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) + 1).toString());
          var neighborL = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) - 1).toString());
          var neighborT = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) - 1).toString()) + boardsquareid.substring(2,5);
          var neighborB = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) + 1).toString()) + boardsquareid.substring(2,5);

          if (($("#" + neighborR).attr("data-placedletter") == "none") OR UNDEFINED &&
             ($("#" + neighborL).attr("data-placedletter") == "none") &&
             ($("#" + neighborT).attr("data-placedletter") == "none") ||
             ($("#" + neighborB).attr("data-placedletter") == "none")) {
            var twowaymultiplier = 2
          } else {
            var twowaymultiplier = 1
          }

          // if ((($("#" + neighborR).attr("data-placedletter") !== "none") ||
          //    ($("#" + neighborL).attr("data-placedletter") !== "none")) &&
          //    (($("#" + neighborT).attr("data-placedletter") !== "none") ||
          //    ($("#" + neighborB).attr("data-placedletter") !== "none"))) {
          //   var twowaymultiplier = 2
          // } else {
          //   var twowaymultiplier = 1
          // }


          var modpoints = stockpoints * multiplier; // * twowaymultiplier;

          $('.letter[data-letter=' + dataid + '] p').text(modpoints);
        });
      }
      updatepointcorners();
      $(".gamemessages span").text(function() {
        $(this).css("color", "yellow");
        return getpoints();
      });
    },
    // out: function(event,ui){
    //   var letterAdd = ui.helper.context.attributes[1].value;
    //   $(this).removeAttr("data-placedletter");
    // }
  });
  $(".tileholder").droppable({
    greedy: false,
    tolerance: "fit",
    drop: function(event,ui){
      var tileorigpoints = parseInt(ui.draggable.context.attributes[2].value);
      ui.helper.find("p").removeClass("cornerpointsdl").removeClass("cornerpointstl");
      ui.helper.find("p").text(tileorigpoints);
      var letterAdd = ui.helper.context.attributes[1].value;
      $(".boardsquare").each(function() {
        if ($(this).attr("data-placedletter") == letterAdd) {
          $(this).attr("data-placedletter", "none");
        }
      });
      var origpoints = ui.helper.context.attributes[2].value;
      $(".boardsquare").each(function() {
        if ($(this).attr("data-placedletterpoints") == origpoints) {
          $(this).attr("data-placedletterpoints", "none");
        }
      });
        // if ($(this).find("span") == "DL") {
        //   $(ui.draggable + " span").text("HI")
        // }

    }
  });

  $(".button.reset").click(function() {
    validwords = [];
    $(".confirmsubmit span").text("0");
    $(".letter").animate({
      "top" : 0,
      "left" : 0
    }, 300);
    $(".letter").each(function() {
      var origpoints = parseInt($(this).attr("data-letterpointsoriginal"));
      $(this).find("p").text(origpoints).removeClass("cornerpointsdl").removeClass("cornerpointstl");
    })
    $(".boardsquare").each(function() {
      $(this).attr("data-placedletter", "none");
      $(this).attr("data-placedletterpoints", "none");
    });
    $(".gamemessages span").text(function() {
        $(this).css("color", "green");
        return 0;
      });
  })

  function getpoints() {
    var words = [];
    validwords = [];
    var boardtotal = 0;

    for (var i=1; i <= 7; i++) {
      $(".boardsquare[id^=r" + i + "]").each(function() {
        var letter = $(this).attr("data-placedletter").charAt(0);
        if (letter !== "n") {
          if ($(this).hasClass("dl")) {
            var letterpoint = letter + 2;
          } else if ($(this).hasClass("tl")) {
            var letterpoint = letter + 3;
          } else if ($(this).hasClass("dw")) {
            var letterpoint = letter + 8;
          } else {
            var letterpoint = letter;
          }
        } else {
          letter = " ";
          var letterpoint = letter;
        }
        words.push(letterpoint);
      });
      words.unshift(" ");
      words.push(" ");
      $(".boardsquare[id$=c" + i + "]").each(function() {
        var letter = $(this).attr("data-placedletter").charAt(0);
        if (letter !== "n") {
          if ($(this).hasClass("dl")) {
            var letterpoint = letter + 2;
          } else if ($(this).hasClass("tl")) {
            var letterpoint = letter + 3;
          } else if ($(this).hasClass("dw")) {
            var letterpoint = letter + 8;
          } else {
            var letterpoint = letter;
          }
        } else {
          letter = " ";
          var letterpoint = letter;
        }
        words.push(letterpoint);
      });
      words.unshift(" ");
      words.push(" ");
    };
    words = words.join("");
    words = words.split(/\s+/g);
    $.each(words, function(index, item) {
      var itemwordlength = item.replace(/\d+/g, "").length;
      if (itemwordlength > 1) {
        validwords.push(item);
      }
    })
    //console.log(validwords)

    function getPointsForWord(word) {
      var wordtotal = 0;
      for (var letterindex = 0; letterindex < word.length; letterindex++) {
        var letter = word[letterindex];
        var afterletter = word[letterindex + 1];
        var lettervalue = 0;
        var lettervaluefinal;
        var pointmodifier;
        if (letter == "L" || letter == "S" || letter == "U" ||
           letter == "N" || letter == "R" || letter == "T" ||
           letter == "O" || letter == "A" || letter == "I" ||
           letter == "E") {
          lettervalue = 1
        } else if (letter == "G" || letter == "D") {
          lettervalue = 2
        } else if (letter == "B" || letter == "C" || letter == "M" || letter == "P") {
          lettervalue = 3
        } else if (letter == "F" || letter == "H" || letter == "V" || letter == "W" || letter == "Y") {
          lettervalue = 4
        } else if (letter == "K") {
          lettervalue = 5
        } else if (letter == "J" || letter == "X") {
          lettervalue = 8
        } else if (letter == "Q" || letter == "Z") {
          lettervalue = 10
        } else {
          lettervalue = 0
        }


        if (afterletter == "2") {
          pointmodifier = 2
        } else if (afterletter == "3") {
          pointmodifier = 3
        } else {
          pointmodifier = 1
        }
        lettervaluefinal = lettervalue * pointmodifier;
        wordtotal = wordtotal + lettervaluefinal;
      }
      if (word.indexOf("8") > -1) {
        var wordmodifier = 2;
      } else {
        var wordmodifier = 1
      }
      var wordonlyletters = word.replace(/\d+/g, "")
      if (wordonlyletters.length == 7) {
        var bingopoints = pointsforbingo;
      } else {
        var bingopoints = 0
      }
      var wordtotalfinal = (wordtotal * wordmodifier) + bingopoints;
      return wordtotalfinal;
    }

    for (var wordindex = 0; wordindex < validwords.length; wordindex++) {
      var wordpoints = getPointsForWord(validwords[wordindex]);
      //console.log(wordpoints)
      boardtotal = boardtotal + wordpoints;
    }
    $(".confirmsubmit span").text(boardtotal);
    return boardtotal;
  }
  var submitstatus = "closed"

  $(".button.submit").click(function() {
    if ($("#r4xc4").attr("data-placedletter") == "none") {
      $(".gamemessages span").css("color", "red");
      $(".unabletosubmit h3").text("Invalid Move");
      $(".unabletosubmit span").text("Center tile must contain letter.");
      $(".unabletosubmit").slideDown(100);
      $("#page-cover").show();
      return
    }
    badwords = [];
    goodwords = [];
    if (submitstatus == "closed") {
      $.ajax({
        url: "/games/checkwords",
        type: "POST",
        dataType:'json',
        data: { 'potentialwords' : validwords,
                'id' : parseInt(document.location.pathname.replace(/[^0-9]/g,'')) }
      })
        .done(function(data) {
          badwords = data[0];
          goodwords = data[1];
          if (badwords.length > 0) {
            console.log(badwords)
            submitattemptbad(badwords, goodwords);
          } else {
            submitattemptgood(goodwords);
          }
        })
    } else {
      $(".button.confirmsubmit").slideToggle(120);
      $(this).text("Submit");
      submitstatus = "closed";
    }
  })

  function submitattemptbad(badones, goodones) {
    var allbadones = badones.join(", ")
    if (badones.length > 1) {
      $(".unabletosubmit h3").text(badones.length + " Invalid Words");
    } else {
      $(".unabletosubmit h3").text("Invalid Word");
    }
    $(".gamemessages span").css("color", "red");
    $(".unabletosubmit span").text(allbadones);
    $(".unabletosubmit").slideDown(100);
    $("#page-cover").show();
    console.log(badones[0])
  }
  function submitattemptgood(goodones) {
    $(".gamemessages span").css("color", "green");
    $(".button.confirmsubmit").slideToggle(120);
    $(".button.submit").text("Cancel");
    submitstatus = "open";
  }
  $(".unabletosubmit").click(function() {
    $(".unabletosubmit").slideUp(150);
    $("#page-cover").hide();
  })
})
