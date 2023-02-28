import GUI from 'lil-gui'
import { lerp, distance } from '@/js/utils/Math'
import gsap from 'gsap'

export default class Component {
  el
  guiObj = {
    attraction: 0.3,
    lerpCoef: 0.05,
  }
  mouse = {
    x: 0,
    y: 0,
  }
  mouseTarget = {
    x: 0,
    y: 0,
  }
  powerX = 0
  powerY = 0

  constructor(el) {
    this.el = el
    this.title = this.el.querySelector('[data-component-title]')
    this.handleResize()
    this.setGUI()
    this.events()
  }

  setGUI() {
    const gui = new GUI()
    gui.add(this.guiObj, 'attraction', 0, 0.5).onChange(() => {
      this.powerX = window.innerWidth * this.guiObj.attraction
      this.powerY = window.innerHeight * this.guiObj.attraction
    })
    gui.add(this.guiObj, 'lerpCoef', 0, 0.2)
  }

  events() {
    window.addEventListener('resize', this.handleResize, false)
    if (!this.isTouch) {
      window.addEventListener('mousemove', this.handleMousemove)
    }
    gsap.ticker.add(this.handleRAF)
  }

  handleResize = () => {
    this.powerX = window.innerWidth * this.guiObj.attraction
    this.powerY = window.innerHeight * this.guiObj.attraction
  }

  handleRAF = () => {
    this.mouseTarget.x = lerp(this.mouseTarget.x, this.mouse.x, this.guiObj.lerpCoef)
    this.mouseTarget.y = lerp(this.mouseTarget.y, this.mouse.y, this.guiObj.lerpCoef)

    this.title.style.transform = `translate(${this.mouseTarget.x * this.powerX}px, ${
      this.mouseTarget.y * this.powerY
    }px)`
  }

  handleMousemove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = (e.clientY / window.innerHeight) * 2 - 1

    const dist = distance(0, 0, x, y)

    this.mouse.x = dist > 0.75 ? 0 : x
    this.mouse.y = dist > 0.75 ? 0 : y
  }
}
