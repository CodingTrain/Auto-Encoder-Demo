int counter = 0;
int W = 28;

void setup() {
  size(280, 280);
}

void draw() {
  background(255);
  //frameRate(5);
  float r = random(0, width);
  strokeWeight(16);
  rectMode(CENTER);
  //float x = random(width);
  //float y = random(height);
  if (random(1) < 0.5) {
    square(width/2, width/2, r);
  } else {
    circle(width/2, width/2, r);
  }

  PImage img = get();
  //img.resize(28, 28);
  img.resize(W, W);
  img.save("data/square" + nf(counter, 4) + ".png");
  counter++;
  if (counter == 5100) {
    exit();
  }
  // noLoop();
}
