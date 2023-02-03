const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const PI2 = Math.PI * 2
const PIhalf = Math.PI / 2
const PI = Math.PI

const C_width = canvas.width
const C_height = canvas.height

const G = 1

const sin = (seta) => { return Math.sin(seta) }
const cos = (seta) => { return Math.cos(seta) }
function print(t) {
    console.log(t)
}

function selectColor(color) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vector2) {
        this.x += vector2.x
        this.y += vector2.y
    }
    mul(m) {
        this.x *= m
        this.y *= m
    }
    div(m) {
        this.x /= m
        this.y /= m
    }
    toStr() {
        return `(${this.x}, ${this.y})`
    }
}

const O = new Vector(350, 350)

function getRad(x1, y1, x2, y2) {
    return Math.atan2(-y2 + y1, -x2 + x1)
}

class Ball {
    constructor(x, y, r, m) {
        this.l = Math.sqrt((x - O.x) ** 2 + (y - O.y) ** 2)
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0)
        this.r = r
        this.m = m

        this.seta = Math.PI / 4
        this.omega = 0
        this.alpha = 0

        this.beforeAlpha = 0

        this.isHeld = false
    }
    get x() {
        return this.pos.x
    }
    get y() {
        return this.pos.y
    }
    get length() {
        return this.l
    }
    getOmega(seta) {
        return -G / this.l * Math.cos(seta)
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.fill()
        ctx.closePath()
    }
    //선속도
    move_l() {
        const seta = getRad(O.x, O.y, this.x, this.y)
        const alpha = PIhalf - seta

        let F = this.m * G * sin(seta)

        //벡터 분리
        F = new Vector(-F * sin(alpha), F * cos(alpha + 4 / 3 * Math.PI))
        F.mul(this.m)
        this.vel.add(F)
        this.pos.add(this.vel)
        //print(`${F.toStr()}\t${this.pos.toStr()}\t${seta * 180 / Math.PI}`)
    }
    //각속도
    move() {
        this.alpha = -1 * G / 10 / this.l * sin(this.seta);
        this.omega += this.alpha;
        this.seta += this.omega;
        this.pos.x = this.length * Math.sin(this.seta) + O.x
        this.pos.y = this.length * Math.cos(this.seta) + O.y

        /*
        let w = -G / this.length * cos(this.seta)
        this.seta += w
        this.pos.x = O.x + this.l * sin(this.seta)
        this.pos.y = O.y + this.l * cos(this.seta)
        print(`${this.pos.toStr()}\t${this.seta * 180 / Math.PI}`)
        */

    }
    Init() {
        this.l = Math.sqrt((this.x - O.x) ** 2 + (this.y - O.y) ** 2)
        this.seta = view_seta
        this.omega = 0
        this.alpha = 0
        this.isHeld = false
    }
}


let ball = new Ball(O.x + 100, O.y + 100, 10, 1)
let view_seta = 0

function render() {
    ctx.clearRect(0, 0, C_width, C_height)

    ctx.beginPath()
    ctx.moveTo(O.x, O.y)
    ctx.lineTo(ball.x, ball.y)
    ctx.stroke()
    ctx.closePath()

    ball.draw()
    if (!ball.isHeld) {
        ball.move()
        //(ball.seta * 180 / PI)
    } else {
        /*selectColor("orange")
        let _x = O.x + 100 * sin(view_seta)
        let _y = O.x + 100 * cos(view_seta)
        ctx.beginPath()
        ctx.moveTo(O.x, O.y)
        ctx.lineTo(_x, _y)
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(_x, _y, 5, 0, PI2)
        ctx.fill()
        ctx.closePath()
        selectColor("black")*/
    }

    requestAnimationFrame(render)
}
render()

canvas.addEventListener("mousedown", (event) => {
    let clickPos = [event.offsetX, event.offsetY]
    let distance = Math.sqrt((clickPos[0] - ball.x) ** 2 + (clickPos[1] - ball.y) ** 2)
    if (distance <= ball.r * 5) {
        ball.isHeld = true
    }
})

canvas.addEventListener("mouseup", (event) => {
    if (ball.isHeld) {
        ball.Init()
    }
})

canvas.addEventListener("mouseleave", (event) => {
    if (ball.isHeld) {
        ball.Init()
    }
})

canvas.addEventListener("mousemove", (event) => {
    if (ball.isHeld) {
        ball.pos.x = event.offsetX
        ball.pos.y = event.offsetY
        view_seta = getRad(O.y, O.x, event.offsetY, event.offsetX) + PI
        //let angle = view_seta * 180 / PI
        //print(`${angle}`)
    }
})