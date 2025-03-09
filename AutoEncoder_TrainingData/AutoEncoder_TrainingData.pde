int counter = 0;
int W = 28;


void setup() {
  size(280, 280);
 
}

void draw() {
  translate(width/2, height/2);
  background(255);
  //frameRate(5);
  float r = random(0, width);
  strokeWeight(16);
  rectMode(CENTER);
 //star(0, 0, r/5, r/2, 6); 
 //star(width/2, height/2, r, r, 4); 
  if (random(1) < 0.5) {
    stroke(255,0,255);
    star(0, 0, r/5, r/2, 6); 
    //square(width/2, height/2, r);
  } else {
    stroke(0,0,255);
    circle(0, 0, r);
  }

  PImage img = get();
  //img.resize(28, 28);
  img.resize(W, W);
  //img.save("Auto-Encoder-Demo/public/data/shape" + nf(counter, 4) + ".png");
  counter++;
  if (counter == 1100) {
    exit();
  }
  //noLoop();
}
//star function taken from Processing website
function star(float x, float y, float radius1, float radius2, int npoints) {
  float angle = TWO_PI / npoints;
  float halfAngle = angle/2.0;
  beginShape();
  for (float a = 0; a < TWO_PI; a += angle) {
    float sx = x + cos(a) * radius2;
    float sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}