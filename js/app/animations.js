angular.module('app.animations', [])

.animation('move', function() {
  return {
    setup : function(element) {
      //prepare the element for animation
      element.css({ 'opacity': 0 });
      console.log(element, element[0].clientHeight, element[0].offsetHeight,element[0].offsetTop);
      var memo = "..."; //this value is passed to the start function
      return memo;
    },
    start : function(element, done, memo) {
      //start the animation
      element.animate({
        'offsetTop' : 30
      }, function() {
        //call when the animation is complete
        done()
      });
    }
  }
});