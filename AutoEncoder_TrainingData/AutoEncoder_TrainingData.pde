int counter = 0;
void setup() {
  size(280, 280);
}

void draw() {
  background(255);
  float r = random(100, 200);
  strokeWeight(16);
  rectMode(CENTER);
  square(width/2, height/2, r);
  PImage img = get();
  img.resize(28, 28);
  img.save("data/square" + nf(counter,3) + ".png");
  counter++;
  if (counter == 550) {
    exit();
  }
  // noLoop();
}
