/*global self */
function calcPrice(distance) {
  'use strict';
  if (distance <= 0) {
    return 0;
  }
  if (distance < 90000) {
    return Math.round(distance * 0.0012);
  } else {
    return Math.round(distance * 0.0009);
  }
}
self.addEventListener('message', function (e) {
  'use strict';
  setTimeout(function () {
    self.postMessage(calcPrice(e.data));
  }, 900);
}, false);
