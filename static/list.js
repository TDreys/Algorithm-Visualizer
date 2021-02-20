class ListAnimator{
  items = [];
  groups = [];
  listGroup = new Two.Group();

  createList(){
    this.groups = [];
    var padding = 20
    var itemSize = 40
    var currentx = 0;
    var i = 0;

    for (i = 0; i < this.items.length; i++) {
      var itemGroup = new Two.Group();
      var rect = two.makeRectangle(0,0,itemSize,itemSize);
      //rect.translation.set(currentx + itemSize/2 + padding,itemSize/2 + padding);
      rect.fill = 'rgba(100, 100, 120, 1)';
      itemGroup.add(rect);

      var text = new Two.Text(this.items[i], 0,0);
      itemGroup.add(text);

      itemGroup.translation.set(currentx + itemSize/2 + padding,itemSize/2 + padding);

      currentx += itemSize + padding;

      this.groups.push(itemGroup);
    }
  }

  draw(){
    two.clear();
    two.add(this.groups);
    two.update();
  }

  setItems(items){
    this.items = Object.values(items)[2];
    this.createList();
    this.draw();
  }

  swap(i,j){
    console.log("animate");
    two.frameCount = 0;

    var iGroup = this.groups[i];
    var jGroup = this.groups[j];

    var radius = (jGroup.translation.x - iGroup.translation.x)/2;
    var center = [iGroup.translation.x + radius,iGroup.translation.y];
    var iAngle = 180;
    var jAngle = 0;
    var delta = 2;
    var frames = 180/delta;

    animate(frames,function(frameCount) {

      iGroup.translation.set(center[0]+(Math.cos(degrees_to_radians(iAngle))*radius),
                            center[1]+Math.sin(degrees_to_radians(iAngle))*radius);

      jGroup.translation.set(center[0]+(Math.cos(degrees_to_radians(jAngle))*radius),
                            center[1]+Math.sin(degrees_to_radians(jAngle))*radius);

      iAngle -= delta;
      jAngle -= delta;

    })

    var temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;

    temp = this.groups[i];
    this.groups[i] = this.groups[j];
    this.groups[j] = temp;

  }

  highlight(index){
    this.groups[index].children[0].fill = "rgba(100, 255, 100, 1)"
  }

  removeHighlights(index){
    for(var i = 0; i < this.groups.length; i++){
      this.groups[i].children[0].fill = "rgba(100, 100, 120, 1)"
    }
  }

  append(item){

    this.items.push(item);
    this.createList();
    this.draw();

    var delta = 2;
    var frames = 180/delta;

    two.bind('update', function(frameCount) {

      timeout = 800;

      if (frameCount > frames){
        two.pause();
        two.unbind('update',null);
      }

    });
  }

  length(){
    return this.items.length;
  }
}
