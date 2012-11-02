define(['jquery', 'line', 'data', 'effin'], function($, Line, data) {

  var types = {
    genre: {
      parents: K(false),
      children: Chain(To('type'), Equal('band'))
    },
    band: {
      parents: Chain(To('type'), Equal('genre')),
      children: Chain(To('type'), Equal('album'))
    },
    album: {
      parents: Chain(To('type'), Equal('band')),
      children: K(false)
    }
  };

  var things = [];

  var Dragger = function (protoElement) {
    e = protoElement;
    var $ele = $(protoElement);
    var $proto = $ele.clone();
    $proto.attr('contenteditable', 'true');

    var type = $proto.data('type');

    $proto.homeX = $proto.x = protoElement.offsetLeft;
    $proto.homeY = $proto.y = protoElement.offsetTop;
    $proto.midX = Math.floor(protoElement.offsetWidth/2);
    $proto.midY = Math.floor(protoElement.offsetHeight/2);
    console.log('proto', $proto.midY, $proto.midX);
    $proto.addClass('ghost').removeClass('proto');
    $proto.css({
        'position': 'absolute'
      });

    console.log('new dragger:', protoElement.id, protoElement);

    function positionUnderMouse($ele, mouseE) {
      $ele.x = mouseE.pageX;
      $ele.y = mouseE.pageY;
      $ele.css({
        top: $ele.y - $proto.midY,
        left: $ele.x - $proto.midX
      });
    }

    var toolbox = document.querySelector('#toolbox');
    function pointInElement(point, element) {
      var x = point[0], y = point[1];
      return (
          (element.offsetLeft < x && x < (element.offsetLeft + element.offsetWidth)) &&
          (element.offsetTop < y  && y < (element.offsetTop + element.offsetHeight))
        );
    }
    function validDropTarget($ele, mouseE) {
      if(pointInElement([mouseE.pageX, mouseE.pageY], toolbox)) {
        return false;
      }

      if (type === 'genre') {
        //can go anywhere
        return true;
      }

      if(prox(types[type].parents, $ele)) {
        return true;
      }

      return false;
    }
    function destroy($ele) {
      $ele.css('-webkit-transform',null).animate({
        top: $proto.homeY,
        left: $proto.homeX
      }, 'fast', 'linear', function(){ $(this).remove(); });
    }

    function distance (x1, y1, x2, y2) {
      return Math.round(Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
      ));
    }

    function distanceFrom (pos) {
      return function(pos2) {
        return distance(pos.x, pos.y, pos2.x, pos2.y);
      };
    }

    function prox(parentPredicate, pos) {
      var nextThing =
        things
        .filter(parentPredicate)
        .map(function(x) { x.dist = distanceFrom(pos)(x); return x; })
        .filter(function (x) { return LessThan(300)(x.dist); }) // max distance
        .map(LogI)
        .reduce(function (a, b) {
          if (!a.dist) return b;
          return b.dist < a.dist ? b : a;
        }, {});

        return nextThing.dist ? nextThing : false;
    }

    $ele.on('mousedown', function (e) {
      e.preventDefault(); // don't start text selection
      var ghost = $proto.clone();

      ghost.line = new Line();
      ghost.line.from($proto).show();

      positionUnderMouse(ghost, e);

      $('#graph').append(ghost);



      $(document).on('mousemove.ghost', function (e) {
        positionUnderMouse(ghost, e);

        var nextThing = prox(types[type].parents, ghost);
        ghost.toggleClass('nodrop', !(nextThing || type === 'genre'));

        if (nextThing) {
          ghost.line.to(nextThing).from(ghost).show().redraw();
        } else {
          ghost.line.hide();
        }

      });

      $(document).on('mouseup.ghost', function (e) {
        if (validDropTarget(ghost, e)) {
          $('#hint').text(things.length === 2 ? '(try double-clicking a thing to change what it says)' : '');
          $(ghost).removeClass('ghost').removeClass('nodrop');

          var k, childData;

          if (type === 'genre') {

            k = RandomKey(data);
            childData = data[k];
            delete data[k];
            ghost.text(k);
            ghost.line.destroy();
          } else {
            var p = prox(types[type].parents, ghost);
            k = RandomKey(p.childData);
            if (p.childData) {
              childData = p.childData[k];
              delete p.childData[k];
            } else {
              childData = {};
            }
            ghost.text(k);
          }

          things.push({
            ele: ghost,
            type: ghost.data('type'),
            childData: childData,
            x: e.pageX,
            y: e.pageY
          });

        } else {
          $('#hint').text('(oops, you can\'t grab that kind of thing until there is another kind of thing on the board');
          ghost.line.destroy();
          destroy(ghost);
        }

        // cleanup
        $(document).off('mousemove.ghost').off('mouseup.ghost');
      });
    });

  };

  $('#graph').on('click','.box', function(e){
    this.style.webkitUserSelect = 'text';
  });

  return Dragger;

});