/*
 * 刮一刮效果
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Scraping = factory());
}(this, (function () {
  "use strict";
  var Scraping = function (options) {
    if (!(options instanceof Object)) {
      throw new Error('参数是一个Object类型');
      return false
    }

    this.opts = {
      canvasWrapId: options.canvasWrapId || '#canvas-wrap',
      canvasId: options.canvasId || '#canvas',
      canvasImg: options.canvasImg,
      canvasColor: options.canvasColor || '#333'
    }

    var $canvasWrap = document.getElementById(this.opts.canvasWrapId.replace('#', ''));
    var $canvas = document.getElementById(this.opts.canvasId.replace('#', ''));

    if (!$canvasWrap) throw new Error('canvaswrap 不存在');
    if (!$canvas) throw new Error('canvas 不存在');

    this.$canvasWrap = $canvasWrap
    this.$canvas = $canvas;

    this.init()
  }
  Scraping.prototype = {
    init: function () {
      this.canvas()
      this.addEvent()
    },
    canvas: function () {
      var $canvasWrap = this.$canvasWrap
      var $canvas = this.$canvas
      var ctx = $canvas.getContext('2d')

      var width = $canvasWrap.offsetWidth
      var height = $canvasWrap.offsetHeight

      $canvas.setAttribute('width', width)
      $canvas.setAttribute('height', height)

      ctx.beginPath()
      if (this.opts.canvasImg) {
        var img = new Image()
        img.src = this.opts.canvasImg
        img.onload = function(){
          ctx.drawImage(img,0,0,canvas.width,canvas.height)
        }
      } else {
        ctx.fillStyle = '#333'
        ctx.fillRect(0, 0, width, height)
      }
      ctx.closePath()
      ctx.fill()
    },
    addEvent: function () {
      var hasTouch = 'ontouchstart' in window ? true : false
      var tapstart = hasTouch ? 'touchstart' : 'mousedown'
      var tapmove = hasTouch ? 'touchmove' : 'mousemove'
      var tapend = hasTouch ? 'touchend' : 'mouseup'

      var $canvas = this.$canvas
      var isTapstart = false
      var pointerArr = []
      $canvas.addEventListener(tapstart, tapstartHandler)
      $canvas.addEventListener(tapmove, tapmoveHandler)
      $canvas.addEventListener(tapend, tapendHandler)

      function tapstartHandler (e) {
        isTapstart = true
        var pointer = getPointer(e)
        pointerArr.push(pointer)
      }

      function tapmoveHandler (e) {
        if (isTapstart) {
          var pointer = getPointer(e)
          pointerArr.push(pointer)
          eraser()
        }
      }

      function tapendHandler () {
        eraser()
        isTapstart = false
        pointerArr = []
      }

      var ctx = this.$canvas.getContext('2d')

      // 橡皮擦
      function eraser () {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pointerArr[0][0], pointerArr[0][1]);
        ctx.lineCap = "round";　　 //设置线条两端为圆弧
        ctx.lineJoin = "round";　　 //设置线条转折为圆弧
        ctx.lineWidth = 30;
        ctx.globalCompositeOperation = "destination-out";
        if (pointerArr.length == 1) {
            ctx.lineTo(pointerArr[0][0], pointerArr[0][1]);
        } else {
            for (var i=1;i<pointerArr.length;i++) {
                ctx.lineTo(pointerArr[i][0], pointerArr[i][1]);
                ctx.moveTo(pointerArr[i][0], pointerArr[i][1]);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      function getPointer (e) {
        var x = hasTouch ? e.targetTouches[0].pageX - $canvas.offsetLeft : e.pageX - $canvas.offsetLeft
        var y = hasTouch ? e.targetTouches[0].pageY - $canvas.offsetTop : e.pageY - $canvas.offsetTop
        return [x, y]
      }
    }
  }
  return Scraping;
})));