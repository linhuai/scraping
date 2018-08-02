/*
 * 刮一刮效果
 * 1. canvasWrap 要设置 position: relative / absolute
 * 2. canvasWrap 父元素及祖先先素不能有 position: relative / absolute
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
      canvasColor: options.canvasColor || '#333',
      percent: options.percent || 90, // 回调函数 调用时间
      callback: options.callback      // 回调函数
    }

    var $canvasWrap = document.getElementById(this.opts.canvasWrapId.replace('#', ''));
    var $canvas = document.getElementById(this.opts.canvasId.replace('#', ''));

    if (!$canvasWrap) throw new Error('canvaswrap 不存在');
    if (!$canvas) throw new Error('canvas 不存在');

    this.$canvasWrap = $canvasWrap
    this.$canvas = $canvas
    this.$ctx = $canvas.getContext('2d')

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

      $canvas.style.position = 'absolute'
      $canvas.style.left = 0
      $canvas.style.top = 0

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
      var self = this
      var $canvas = this.$canvas
      var $canvasWrap = this.$canvasWrap

      var hasTouch = 'ontouchstart' in window ? true : false
      var tapstart = hasTouch ? 'touchstart' : 'mousedown'
      var tapmove = hasTouch ? 'touchmove' : 'mousemove'
      var tapend = hasTouch ? 'touchend' : 'mouseup'

      var isTapstart = false
      var pointerArr = []
      $canvas.addEventListener(tapstart, function (e) {
        isTapstart = true
        pointerArr.push(getPointer(e))

        $canvas.addEventListener(tapmove, tapmoveHandler)
        $canvas.addEventListener(tapend, tapendHandler)
      })


      function tapmoveHandler (e) {
        e.preventDefault()
        if (isTapstart) {
          pointerArr.push(getPointer(e))
          eraser()
        }
      }

      function tapendHandler (e) {
        if (isTapstart) {
          eraser()
          isTapstart = false
          pointerArr = []

          $canvas.removeEventListener(tapmove, tapmoveHandler)
          $canvas.removeEventListener(tapend, tapendHandler)

          var percent = self.getPercent()
          if (percent >= self.opts.percent) {
            $canvas.style.opacity = 0
            self.opts.callback && self.opts.callback()
          }
        }
      }

      var ctx = this.$canvas.getContext('2d')

      // 橡皮擦
      function eraser () {
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
        ctx.stroke();
        ctx.restore();
      }

      function getPointer (e) {
        var x = (hasTouch ? e.targetTouches[0].pageX : e.pageX) - $canvasWrap.offsetLeft
        var y = (hasTouch ? e.targetTouches[0].pageY : e.pageY) - $canvasWrap.offsetTop
        return [x, y]
      }
    },
    getPercent: function() {
      var percent = 0
      var counter = 0
      var imageData = this.$ctx.getImageData(0, 0, this.$canvas.width, this.$canvas.height);
      var imageDataLength = imageData.data.length;

      for(var i = 0; i < imageDataLength; i += 4) {
        if (imageData.data[i] === 0 && imageData.data[i+1] === 0 && imageData.data[i+2] === 0 && imageData.data[i+3] === 0) {
          counter++;
        }
      }

      if (counter >= 1) {
        percent = (counter / (this.$canvas.width * this.$canvas.height)) * 100;
      } else {
        percent = 0;
      }
      return percent;
    }
  }
  return Scraping;
})));