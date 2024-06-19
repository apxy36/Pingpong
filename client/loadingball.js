class LoadingBall {
  constructor() {
    this.x = width/2;
    this.y = height/2;
    this.velocity = createVector(random(-5, 5), random(-5, 5));
    this.radius = 10;
    this.color = color('green');
    this.prevpos = []
  }
  display(){
    circle(this.x, this.y, this.radius)
    strokeWeight(0)
    for (let i = this.prevpos.length - 1; i >= 0; i--) {
      this.color.setAlpha(255 * ((i + 1) / 10))
      circle(this.prevpos[i].x, this.prevpos[i].y, this.radius)
    }

  }

  update(){
    this.prevpos.push(createVector(this.x, this.y))
    if (this.prevpos.length > 10) {
      this.prevpos.shift()
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
  checkEdges(){
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      this.x = 0
      this.y = 0

    }
    //bounce
    if (this.x > width || this.x < 0) {
      this.velocity.x = -this.velocity.x
    }
    if (this.y > height || this.y < 0) {
      this.velocity.y = -this.velocity.y
    }
  } 
}
