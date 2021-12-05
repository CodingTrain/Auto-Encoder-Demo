int counter = 0;
int W = 56;

void setup() {
  size(280, 280);
}

void draw() {
  background(255);
  float r = random(25, 200);
  strokeWeight(16);
  rectMode(CENTER);
  if (random(1) < 0.5) {
    square(width/2, height/2, r);
  } else {
    circle(width/2, height/2, r);
  }

  PImage img = get();
  //img.resize(28, 28);
  img.resize(W, W);
  img.save("data/square" + nf(counter, 4) + ".png");
  counter++;
  if (counter == 1100) {
    exit();
  }
  // noLoop();
}
