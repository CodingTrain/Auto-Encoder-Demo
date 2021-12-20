int counter = 0;
int W = 28;
Cat c;
Unicorn u;
Dog d;

void setup() {
  size(280, 280);
  c = new Cat();
  u = new Unicorn();
  d = new Dog();
}

void draw() {
  translate(width/2, height/2);
  background(255);
  //frameRate(5);
  //float r = random(0, width);
  //strokeWeight(8);
  
  if (random(1) < 0.5) {
   c.display();
  } else {
   u.display();
  }

  PImage img = get();
  //img.resize(28, 28);
  img.resize(W, W);
  img.save("data/animal" + nf(counter, 4) + ".png");
  counter++;
  if (counter == 100) {
   exit();
  }
   noLoop();
}
class Cat {
      float w;
      float h;
      
      Cat() {
        w = random(160,240);
        h = random(160,240);
      }
    
    void display() {
      //draw face
      stroke(0);
      strokeWeight(6);
      beginShape();
      vertex(-0.20*w, 0.25*h);
      //left side of head
      bezierVertex(-0.45*w, 0.15*h, -0.30*w, -0.15*h, -0.20*w, -0.25*h);
  
      //top of head
      bezierVertex(-0.15*w, -0.30*h, -0.05*w, -0.30*h, 0, -0.30*h);
      bezierVertex(0.05*w, -0.30*h, 0.15*w, -0.30*h, 0.20*w, -0.25*h);
     //right side of head
      bezierVertex(0.30*w, -0.15*h, 0.45*w, 0.15*h, 0.20*w, 0.25*h);
      //bottom of head
      bezierVertex(0.10*w, 0.30*h, 0.05*w, 0.30*h, 0, 0.30*h);
      bezierVertex(-0.05*w, 0.30*h, -0.10*w, 0.30*h, -0.20*w, 0.25*h);
      endShape();
      
      //draw eyes
      strokeWeight(3);
      beginShape();
      vertex(0.10*w, -0.04*h);
      bezierVertex(0.125*w, -0.10*h,0.175*w, -0.10*h, 0.20*w, -0.08*h);
       bezierVertex(0.175*w, -0.00*h,0.125*w, -0.00*h, 0.10*w, -0.04*h);
      endShape();
      ellipse(0.15*w, -0.05*h, 0.02*w,0.05*h);
      
      beginShape();
      vertex(-0.10*w, -0.04*h);
      bezierVertex(-0.125*w, -0.10*h,-0.175*w, -0.10*h,-0.20*w, -0.08*h);
       bezierVertex(-0.175*w, -0.00*h,-0.125*w, -0.00*h,-0.10*w, -0.04*h);
      endShape();
      ellipse(-0.15*w, -0.05*h, -0.02*w, 0.05*h);
      
      //draw right ear
      strokeWeight(6);
      beginShape();
      vertex(0.20*w, -0.25*h);
      bezierVertex(0.25*w, -0.45*h, 0.20*w, -0.45*h,0.05*w, -0.30*h);
      endShape();
    
       //draw left ear
      beginShape();
      vertex(-0.05*w, -0.30*h);
      bezierVertex(-0.20*w, -0.45*h, -0.25*w, -0.45*h,-0.20*w, -0.25*h);
      endShape();
      
      //draw left whiskers
      strokeWeight(2);
       line(-0.085*w, 0.08*h, -0.2325*w, 0.04*h);
       line(-0.085*w, 0.10*h, -0.2675*w, 0.10*h);
       line(-0.085*w, 0.12*h, -0.2325*w, 0.16*h);
      // //draw right whiskers
       line(0.085*w, 0.08*h, 0.2325*w, 0.04*h);
       line(0.085*w, 0.10*h, 0.2675*w, 0.10*h);
       line(0.085*w, 0.12*h, 0.2325*w, 0.16*h);
      
      // draw nose
      strokeWeight(3);
      beginShape();
      vertex(0,0.12*h);
      bezierVertex(0.1*w, 0.05*h,-0.1*w, 0.05*h,0.00*w, 0.12*h);
      endShape();
      
      //draw mouth
      beginShape();
      vertex(0,0.12*h);
      bezierVertex(-0.01*w, 0.20*h, 0.05*w, 0.20*h, 0.075*w, 0.175*h);
      endShape();
         beginShape();
      vertex(0,0.12*h);
      bezierVertex(0.01*w, 0.20*h, -0.05*w, 0.20*h, -0.075*w, 0.175*h);
      endShape();
   }
      
} 

class Unicorn {
  
    float w;
    float h;
    
    Unicorn() {
        w = random(120,160);
        h = random(200,260);
      }
  void display() {
    
    stroke(0);
    strokeWeight(6);
    //draw face
    beginShape();
    vertex(-0.15*w, 0.25*h);
    //left side of head
    bezierVertex(-0.3*w, 0.15*h, -0.45*w, -0.15*h, -0.25*w, -0.25*h);

    //top of head
    bezierVertex(-0.15*w, -0.30*h, -0.05*w, -0.30*h, 0, -0.30*h);
    bezierVertex(0.05*w, -0.30*h, 0.15*w, -0.30*h, 0.25*this.w, -0.25*h);
   //right side of head
    bezierVertex(0.45*w, -0.15*h, 0.3*w, 0.15*h, 0.15*w, 0.25*h);
    //bottom of head
    bezierVertex(0.08*w, 0.30*h, 0.05*w, 0.30*this.h, 0, 0.30*h);
    bezierVertex(-0.05*w, 0.30*h, -0.08*w, 0.30*h, -0.15*w, 0.25*h);
    endShape();
    
    //draw eyes
    strokeWeight(3);
    beginShape();
    vertex(0.22*w, -0.05*h);
     bezierVertex(0.195*w, -0.00*h,0.105*w, -0.00*h,0.07*w, -0.05*h);
    endShape();
    beginShape();
     vertex(-0.22*w, -0.05*h);
     bezierVertex(-0.195*w, -0.00*h,-0.105*w, -0.00*h,-0.07*w, -0.05*h);
    endShape();
    
    //eyelashes
//     line(0.22*this.w, -0.05*this.h, 0.260*this.w, -0.04*this.h);
//     line(0.18*this.w, -0.01*this.h, 0.200*this.w, 0.01*this.h);
//     line(0.18*this.w, -0.01*this.h, 0.200*this.w, 0.01*this.h);
   
    
    //draw right ear
    strokeWeight(6);
    beginShape();
    vertex(0.25*w, -0.25*h);
    bezierVertex(0.35*w, -0.25*h, 0.25*w, -0.55*h,0.10*w, -0.3*h);
    endShape();
  
     //draw left ear
    beginShape();
    vertex(-0.1*w, -0.30*h);
    bezierVertex(-0.25*w, -0.55*h, -0.35*w, -0.25*h,-0.25*w, -0.25*h);
    endShape();
    
    //draw nostrils
    strokeWeight(2);
    ellipse(0.05*w, 0.20*h, 0.0005*w,0.001*h);
    ellipse(0.05*w, 0.20*h, 0.0005*w,0.001*h);
    
    //draw horn
    strokeWeight(4);
    beginShape();
    vertex(-0.1*w, -0.15*h);
    bezierVertex(-0.10*w, -0.60*h,0.10*w, -0.60*h,0.10*w, -0.15*h);
    endShape();
    //bottom line
    beginShape();
    vertex(-0.09*w, -0.22*h);
    bezierVertex(-0.05*w, -0.18*h,0.10*w, -0.30*h,0.08*w, -0.27*h);
    endShape();
    //top line
     beginShape();
    vertex(-0.08*w, -0.30*h);
    bezierVertex(-0.08*w, -0.25*h,0.05*w, -0.35*h,0.06*w, -0.35*h);
    endShape();
  
    beginShape();
    vertex(-0.25*w, -0.08*h);
    bezierVertex(-0.02*w, -0.05*h,0.02*w, -0.15*h,0.1*w, -0.15*h);
    bezierVertex(0.02*w, -0.25*h,-0.02*w, -0.15*h,-0.25*w, -0.08*h);
    endShape();
    
    //draw nostrils
    ellipse(0.05*w, 0.20*h, 2,6);
    ellipse(-0.05*w, 0.20*h, 2,6);
 }
    
}