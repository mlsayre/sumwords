var ready = function() {
  if ($(".gameboard").length) {
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

    var boardsquares = [r1xc1, r1xc2, r1xc3, r1xc4, r1xc5, r1xc6, r1xc7,
                        r2xc1, r2xc2, r2xc3, r2xc4, r2xc5, r2xc6, r2xc7,
                        r3xc1, r3xc2, r3xc3, r3xc4, r3xc5, r3xc6, r3xc7,
                        r4xc1, r4xc2, r4xc3, r4xc4, r4xc5, r4xc6, r4xc7,
                        r5xc1, r5xc2, r5xc3, r5xc4, r5xc5, r5xc6, r5xc7,
                        r6xc1, r6xc2, r6xc3, r6xc4, r6xc5, r6xc6, r6xc7,
                        r7xc1, r7xc2, r7xc3, r7xc4, r7xc5, r7xc6, r7xc7];

    boardsortables = [];
    for (var i = 0; i < boardsquares.length; i++) {

      boardsortables[i] = new Sortable(boardsquares[i], {
        group: "tiles",
        animation: 0,
        onAdd: function (evt) {
          //console.log(evt)
          var el = evt.item;
          var targ = evt.target;
          $(el).addClass("onboard").removeClass("faded");

          var letterAdd = el.attributes[1].value;
          if ($(targ).attr("data-placedletter") == "none") {
            $(".boardsquare").each(function() {
              if ($(this).attr("data-placedletter") == letterAdd) {
                $(this).attr("data-placedletter", "none");
              }
            });
            $(targ).attr("data-placedletter", letterAdd);
          }
          var origpoints = el.attributes[2].value;
          if ($(targ).attr("data-placedletterpoints") == "none") {
            $(".boardsquare").each(function() {
              if ($(this).attr("data-placedletterpoints") == origpoints) {
                $(this).attr("data-placedletterpoints", "none");
              }
            });
            $(targ).attr("data-placedletterpoints", origpoints);
          }


        },
        onStart: function (evt) {
          var excludeself = $(".boardsquare").index(evt.srcElement);
          for (var i = 0; i < bslength; i++) {
            if (boardsortables[i].el.firstElementChild) {
              boardsortables[i].options.disabled = true;
            }
            boardsortables[excludeself].options.disabled = false;
          }
        },
        onEnd: function (evt) {
          $(".faded").removeClass("faded");
          for (var i = 0; i < bslength; i++) {
            boardsortables[i].options.disabled = false
          }
          updatepointcorners();
          $(".gamemessages span").text(function() {
            $(this).css("color", "yellow");
            return getpoints();
          });
        },
        onMove: function (evt) {
          var el = evt.dragged;
          var dest = evt.to;
          if (dest == tilerack) {
            $(el).addClass("onrack").removeClass("sortable-ghost").removeClass("faded");
          } else if (dest !== tilerack) {
            $(el).addClass("sortable-ghost faded").removeClass("onrack");
          }
        }
      });
    }
    var bslength = boardsortables.length;

    racksortable = new Sortable(tilerack, {
      group: "tiles",
      animation: 150,
      chosenClass: "onrack",
      onAdd: function (evt) {
        var el = evt.item;
        var fromspace = evt.from;
        $(el).removeClass("onboard").removeClass("onrack").removeClass("faded");

        $(fromspace).attr("data-placedletter", "none").attr("data-placedletterpoints", "none");
      },
      onStart: function (evt) {
        for (var i = 0; i < bslength; i++) {
          if (boardsortables[i].el.firstElementChild) {
            boardsortables[i].options.disabled = true;
          }
        }
      },
      onEnd: function (evt) {
        $(".faded").removeClass("faded");
        for (var i = 0; i < bslength; i++) {
          boardsortables[i].options.disabled = false
        }
        updatepointcorners();
          $(".gamemessages span").text(function() {
            $(this).css("color", "yellow");
            return getpoints();
          });
      },
      onMove: function (evt) {
        var el = evt.dragged;
        var dest = evt.to;
        if ($(dest).hasClass("boardsquare")) {
          $(el).addClass("onboard faded").removeClass("onrack");
        } else if (!$(dest).hasClass("boardsquare")) {
          $(el).addClass("onrack").removeClass("onboard").removeClass("faded");
        }
      }
    });


    $(".button.reset").click(function() {
      validwords = [];
      $(".confirmsubmit span").text("0");
      $(".boardsquare[data-placedletter!='none']").each(function() {
        $(this).find(".letter").detach().appendTo(".tilerack1").removeClass("onboard").removeClass("faded");
      });
      updatepointcorners();

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
        //console.log($(this))
        var dataid = $(this).attr("data-placedletter");
        var stockpoints = parseInt($(this).find('.letter').attr("data-letterpointsoriginal"));
        var boardsquareid = $(this).attr("id");
        if ($("#" + boardsquareid).text().substring(0,2) == "DL") {
          var multiplier = 2;
          $(this).find(".letter p").addClass("cornerpointsdl");
        } else if ($("#" + boardsquareid).text().substring(0,2) == "TL") {
          var multiplier = 3;
          $(this).find(".letter p").addClass("cornerpointstl");
        } else {
          var multiplier = 1;
          $(this).find(".letter p").removeClass("cornerpointsdl").removeClass("cornerpointstl")
        }

        var modpoints = stockpoints * multiplier; // * twowaymultiplier;
        console.log(stockpoints + " " + multiplier)
        $(this).find(".letter p").text(modpoints);
      });

      $(".tilerack1 .letter").each(function() {
        var stockpoints = parseInt($(this).attr("data-letterpointsoriginal"));
        $(this).find("p").removeClass("cornerpointsdl").removeClass("cornerpointstl")
        $(this).find("p").text(stockpoints);
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
      // if (($(".boardsquare[data-placedletter!='none']").length == 1) && ($("#r4xc4").attr("data-placedletter") !== "none")) {
      //   errorOnSubmission("Please play more than one letter.");
      //   return
      // }
      // check to see if only one
      if ($(".boardsquare[data-placedletter!='none']").length == 1) {
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
      //console.log(playedspaces);
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

  };
}
$(document).ready(ready);
$(document).on('page:load', ready);
