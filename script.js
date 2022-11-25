const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const LENGTH = 50
const GRAVITY_SCALE = 0.2

const print = (t) => console.log(t)

function selectColor(color) {
    ctx.strokeStyle = color
    ctx.fillStyle = color
}

function drawCircle(pos, r) {
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

function lineTo(pos1, pos2) {
    ctx.beginPath()
    ctx.moveTo(pos1.x, pos1.y)
    ctx.lineTo(pos2.x, pos2.y)
    ctx.stroke()
    ctx.closePath()
}

function getSym(n) {
    if (n < 0) {
        return -1
    }
    return 1
}

//With two vector
function getRadian(A, B) {
    let radian = Math.atan2(B.x - A.x, B.y - A.y)
    return radian
}

function getAngle(A, B) {
    var r = Math.atan2(B.x - A.x, B.y - A.y);
    //alert(r+'radians');
    if (r < 0)
        r += Math.PI * 2;
    var d = r * 180 / Math.PI;
    d+= -90
    while (d < 0)
        d += 360;
    //alert(d+'degrees'); 
    return d
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    set(x, y) {
        this.x = x
        this.y = y
    }
    clone() {
        return new Vector(this.x, this.y)
    }
    add(vector2) {
        this.x += vector2.x
        this.y += vector2.y
    }
}

const FIXED_POS = new Vector(300, 300)

class Ball {
    constructor(x, y, mass) {
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0)
        this.mass = mass
        this.l=0
    }
    get x() {
        return this.pos.x
    }
    get y() {
        return this.pos.y
    }
    move() {
        const rad = getRadian(FIXED_POS, this.pos)
        const sin = Math.sin(rad)
        const cos = Math.cos(rad)
        const mg = this.mass * GRAVITY_SCALE

        let deg=parseInt(getAngle(FIXED_POS, this.pos))
        
        print(`${parseInt(getAngle(FIXED_POS, this.pos))}\t${deg-this.l}`)
        this.vel = new Vector(-getSym(cos) * mg * (cos ** 2), getSym(sin) * mg * (sin ** 2))
        this.l=deg
        this.pos.add(this.vel)
    }
    draw() {
        drawCircle(this.pos, 10)
    }
}

const ball = new Ball(350, 300, 10)
selectColor("black")
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircle(FIXED_POS, 5)
    lineTo(FIXED_POS, ball.pos)
    //ball.move()
    print(`${parseInt(getAngle(FIXED_POS, ball.pos))}`)
    ball.draw()
    requestAnimationFrame(render)
}
render()