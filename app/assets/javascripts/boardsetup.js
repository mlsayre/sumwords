var ready = function() {
  var pointsforbingo = 15;
  var validwords = [];
  var badwords = [];
  var goodwords = [];
  var playedspaces = [];
  var allwordsarray = [];
  $(".dw").not("#r4xc4").text("DW");
  $(".dl").text("DL");
  $(".tl").text("TL");

  if ($(".gameboard")[0]) {
    $.ajax({
        url: "/gamedata/getallwords",
        type: "POST",
        dataType:'json',
        data: { 'id' : parseInt(document.location.pathname.replace(/[^0-9]/g,'')) }
      })
        .done(function(data) {
          allwordsarray = data[0];
        })
  }

  $(".letter").draggable({
    zIndex: 100,
    opacity: 0.7,
    revert: "invalid",
    revertDuration: 300,
    //containment: "window",
    connectToSortable: ".tilerack1",
    stop: function(){
      $(this).draggable('option','revert','invalid');
    }
  });
  $('.letter').droppable({
    greedy: false,
    tolerance: 'intersect',
    drop: function(event,ui){
      ui.draggable.draggable('option','revert', true);
    },
  });
  $(".boardsquare").droppable({
    greedy: true,
    tolerance: "intersect",
    drop: function(event,ui){
      var letterAdd = ui.helper.context.attributes[1].value;
      if ($(this).attr("data-placedletter") == "none") {
        $(".boardsquare").each(function() {
          if ($(this).attr("data-placedletter") == letterAdd) {
            $(this).attr("data-placedletter", "none");
          }
        });
        $(this).attr("data-placedletter", letterAdd);
        ui.helper.removeClass("rackletter");
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

      updatepointcorners();
      $(".gamemessages span").text(function() {
        $(this).css("color", "yellow");
        return getpoints();
      });
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 50, "linear");
        }
      });
    },
    // out: function(event,ui){
    //   var letterAdd = ui.helper.context.attributes[1].value;
    //   $(this).removeAttr("data-placedletter");
    // }
  });
  $(".tilerack1").droppable({
    //greedy: true,
    //tolerance: "touch",
    //drop: function(event,ui){
      //ui.helper.addClass("rackletter");
      // var tileorigpoints = parseInt(ui.draggable.context.attributes[2].value);
      // ui.helper.find("p").removeClass("cornerpointsdl").removeClass("cornerpointstl");
      // ui.helper.find("p").text(tileorigpoints);
      // var letterAdd = ui.helper.context.attributes[1].value;
      // $(".boardsquare").each(function() {
      //   if ($(this).attr("data-placedletter") == letterAdd) {
      //     $(this).attr("data-placedletter", "none");
      //   }
      // });
      // var origpoints = parseInt(ui.helper.context.attributes[2].value);
      // $(".boardsquare").each(function() {
      //   if ($(this).attr("data-placedletterpoints") == origpoints) {
      //     $(this).attr("data-placedletterpoints", "none");
      //   }
      // });
      // updatepointcorners();
      // $(".gamemessages span").text(function() {
      //   $(this).css("color", "yellow");
      //   return getpoints();
      // });

    //}
  });

  $(".tilerack1").sortable({
    //items : "> .rackletter",
    //containment: ".gamearea",
    tolerance: "pointer",
    // out: function( event, ui ) {
    //   ui.helper.removeClass("rackletter");
    // },
    //over: function( event, ui ) {
      
      // var tileorigpoints = parseInt(ui.draggable.context.attributes[2].value);
      // ui.helper.find("p").removeClass("cornerpointsdl").removeClass("cornerpointstl");
      // ui.helper.find("p").text(tileorigpoints);
      // var letterAdd = ui.helper.context.attributes[1].value;
      // $(".boardsquare").each(function() {
      //   if ($(this).attr("data-placedletter") == letterAdd) {
      //     $(this).attr("data-placedletter", "none");
      //   }
      // });
      // var origpoints = parseInt(ui.helper.context.attributes[2].value);
      // $(".boardsquare").each(function() {
      //   if ($(this).attr("data-placedletterpoints") == origpoints) {
      //     $(this).attr("data-placedletterpoints", "none");
      //   }
      // });
      // updatepointcorners();
      // $(".gamemessages span").text(function() {
      //   $(this).css("color", "yellow");
      //   return getpoints();
      // });
    //}
  });

  $(".button.reset").click(function() {
    validwords = [];
    $(".confirmsubmit span").text("0");
    $(".letter").animate({
      "top" : 0,
      "left" : 0
    }, 500);
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

  function updatepointcorners() {
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
      // var neighborR = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) + 1).toString());
      // var neighborL = boardsquareid.substring(0,4) + ((parseInt(boardsquareid.charAt(4)) - 1).toString());
      // var neighborT = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) - 1).toString()) + boardsquareid.substring(2,5);
      // var neighborB = boardsquareid.substring(0,1) + ((parseInt(boardsquareid.charAt(1)) + 1).toString()) + boardsquareid.substring(2,5);

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

  function errorOnSubmission(errormessage) {
    $(".gamemessages span").css("color", "red");
    $(".unabletosubmit h3").text("Invalid Move");
    $(".unabletosubmit span").text(errormessage);
    $(".unabletosubmit").slideDown(100);
    $("#page-cover").show();
  }

  $(".button.submit").click(function() {
    // check to see if no letters have been played
    if ($(".boardsquare[data-placedletter!='none']").length == 0) {
      errorOnSubmission("Can't submit an empty board.");
      return
    }
    // check to see if only center tile is played
    if (($(".boardsquare[data-placedletter!='none']").length == 1) && ($("#r4xc4").attr("data-placedletter") !== "none")) {
      errorOnSubmission("Please play more than one letter.");
      return
    }
    // check to make sure center square is played
    // if ($("#r4xc4").attr("data-placedletter") == "none") {
    //   errorOnSubmission("The center tile must contain a letter.");
    //   return
    // }
    // make sure all words are connected
    playedspaces = [];
    checkContinuity($(".boardsquare[data-placedletter!='none']:first").attr("id"));
    console.log(playedspaces);
    if (playedspaces.length < $(".boardsquare[data-placedletter!='none']").length) {
      errorOnSubmission("Words must all be connected.");
      return
    }
    // then submit words for validation
    function checkwords(words) {
      badwords = [];
      goodwords = [];
      var preparedwords = [];
      for (var i = 0; i < words.length; i++) {
        preparedwords.push(words[i].replace(/[0-9]/g, '').toLowerCase());
      }
      var potentialwords = preparedwords;
      var wordslength = potentialwords.length;
      for (var i = 0; i < wordslength; i++) {
        if (allwordsarray.indexOf(potentialwords[i]) > -1) {
          goodwords.push(potentialwords[i])
        } else {
          badwords.push(potentialwords[i])
        }
      }
      if (badwords.length > 0) {
        submitattemptbad(badwords, goodwords);
      } else {
        submitattemptgood(goodwords);
      }
    }
    checkwords(validwords);
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
  }
  function submitattemptgood(goodones) {
    $(".gamemessages span").css("color", "green");
    $(".confirmsubmit").slideToggle(120);
    $("#page-cover").show();
    $(".finalcancel").click(function() {
      $(".confirmsubmit").slideUp(120);
      $("#page-cover").hide();
    })
  }
  $(".unabletosubmit").click(function() {
    $(".unabletosubmit").slideUp(150);
    $("#page-cover").hide();
  });

  function checkContinuity(tile) {
    var neighborR = tile.substring(0,4) + ((parseInt(tile.charAt(4)) + 1).toString());
    var neighborL = tile.substring(0,4) + ((parseInt(tile.charAt(4)) - 1).toString());
    var neighborT = tile.substring(0,1) + ((parseInt(tile.charAt(1)) - 1).toString()) + tile.substring(2,5);
    var neighborB = tile.substring(0,1) + ((parseInt(tile.charAt(1)) + 1).toString()) + tile.substring(2,5);

    if (playedspaces.indexOf(tile) == -1) {
      playedspaces.push(tile);
    }
    function checkNeighbor(neighbor) {
      if (($("#" + neighbor).attr("data-placedletter") !== "none") && ($("#" + neighbor).attr("data-placedletter") !== undefined)) {
        if (playedspaces.indexOf(neighbor) == -1) {
          playedspaces.push(neighbor);
          checkContinuity(neighbor);
        }
      }
    }
    checkNeighbor(neighborR);
    checkNeighbor(neighborL);
    checkNeighbor(neighborT);
    checkNeighbor(neighborB);
  }

  // when submitting board
  $(".finalsubmit").click(function() {
    var finalboardpoints = getpoints();
    var finaltilearray = [];
    var finaltilepositions = function() {
      for (var i = 1; i <= 9; i++) {
        var tilepos;
        tilepos = $('*[data-placedletter$="letter0' + i + '"]').attr("id");
        if (tilepos === undefined) { tilepos = "none"}
        finaltilearray.push(tilepos);
      }
      var lasttilepos = $('*[data-placedletter$="letter10"]').attr("id");
      if (lasttilepos === undefined) { lasttilepos = "none"}
      finaltilearray.push(lasttilepos);
      finaltilearray.join();
      return finaltilearray;
    }
    var lettersused = function() {
      var arrlength = finaltilearray.length;
      var lettercount = 0;
      for (var i = 0; i < arrlength; i++) {
        if (finaltilearray[i] != "none") {
          lettercount++
        }
      }
      return lettercount;
    }
    $.ajax({
      url: "/gamedata/gamecompleted",
      type: "POST",
      dataType:'json',
      data: { 'finalpoints' : finalboardpoints,
              'finalpositions' : finaltilepositions,
              'lettersused' : lettersused,
              'game_id' : parseInt(document.location.pathname.replace(/[^0-9]/g,'')) }
    })
      .done(function(data) {
        var completedmessage = data[0];
        var userloggedin = data[1];
        if (userloggedin == 0) {
          $(".confirmsubmit").slideToggle(120);
          $(".submitmessage").slideDown(120);
          $(".submitmessage span").text(completedmessage);;
        } else {
          $(".confirmsubmit").slideToggle(120);
          $(".submitmessage").slideDown(120);
          $(".submitmessage span").text(completedmessage);
          var pathname = window.location.pathname;
          $("#menuwindow").load(pathname + " #menuwindowcontents");
        }
      })
  })

  $(".completedtohs").click(function() {
    window.location.href = window.location.href + '/highscores';
  })
  $(".completedrtg").click(function() {
    $("#page-cover").hide();
    $(".submitmessage").slideToggle(120);
    $("body").scrollTop();
  })
  $(".button.menu").click(function() {
    $("#page-cover").show();
    $("#menuwindow").slideDown(120);
  });
  $("body").on("click", ".button.howtoplay", function() {
    $("#menuwindow").slideToggle(120);
    $("#howtoplay").slideDown(120);
  });
  $(".button.returntomenu").click(function() {
    $("#howtoplay").slideToggle(120);
    $("#menuwindow").slideDown(120);
  });
  $(".button.returntogame").click(function() {
    $("#howtoplay").slideToggle(120);
    $("#page-cover").hide();
  });


  $("#page-cover").click(function() {
    $("#page-cover").hide();
    if ($("#menuwindow").css("display") != "none") {
      $("#menuwindow").slideToggle(120);
    }
    if ($("#howtoplay").css("display") != "none") {
      $("#howtoplay").slideToggle(120);
    }
    if ($(".confirmsubmit").css("display") != "none") {
      $(".confirmsubmit").slideToggle(120);
    }
    if ($(".unabletosubmit").css("display") != "none") {
      $(".unabletosubmit").slideToggle(120);
    }
  });

  // $(window).resize(function() {
  //   $(".letter").each( function() {
  //     var dataid = $(this).attr("data-letter");
  //     if ($(".boardsquare[data-placedletter='" + dataid + "']")) {
  //       var target = $(".boardsquare[data-placedletter='" + dataid + "']")
  //       if (dataid == target.attr("data-placedletter")) {
  //         var position = {}
  //         position = target.position($(this));
  //         $(this).animate({
  //           "top" : 0 - position.top,
  //           "left" : 0 - position.left
  //         }, 300);
  //         console.log(position)
  //       }
  //     }
  //   });
  // });
};
$(document).ready(ready);
$(document).on('page:load', ready);
