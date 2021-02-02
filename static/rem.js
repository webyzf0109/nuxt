//rem适配
(function (d) {
  var root = document.documentElement;
  var t, w
  var r = function () {
    w = root.clientWidth;
    root.style.maxWidth = w + "px"
    root.style.fontSize = (w > d ? d : w < 320 ? 320 : w) / d * 100 + "px";
  }
  var s = function () {
    clearTimeout(t);
    t = setTimeout(r, 100)
  };
  window.addEventListener("resize", s); r()
})(750);
