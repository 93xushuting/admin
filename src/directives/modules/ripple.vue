<script>
export default {
  inserted (el, binding, vnode, oldVnode) {
    let tagart = el.tagName
    el.addEventListener('click', (e) => {
      // console.info('v-ripple : ' + tagart)
      let _this = e.currentTarget
      _this.style.position = 'relative'
      var re = document.getElementsByClassName('ripple')
      for (var i = re.length - 1; i >= 0; i--) {
        try {
          re[i].remove()
        } catch (e) {
          var _parentElement = re[i].parentNode
          if (_parentElement) {
            _parentElement.removeChild(re[i])
          }
        }
      }
      let pos = _this.getBoundingClientRect()
      let left = pos.left
      let top = pos.top
      let width = pos.width
      let height = pos.height
      let x = e.pageX - left - width / 2
      let y = e.pageY - top - width / 2
      // console.info(x, y)
      let div = document.createElement('span')
      div.className = 'ripple rippleEffect'
      div.style.width = width + 'px'
      div.style.height = width + 'px'
      div.style.top = y + 'px'
      div.style.left = x + 'px'
      _this.appendChild(div)
    }, false)
  }
}
</script>
<style lang="less">
.ripple {
  position: absolute;
  border-radius: 50% 50%;
  background: rgba(255, 255, 255, 0.7);
  transform: scale(0);
  opacity: 1;
}
.rippleEffect {
  animation: rippleDrop .5s linear;
}
@keyframes rippleDrop {
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
