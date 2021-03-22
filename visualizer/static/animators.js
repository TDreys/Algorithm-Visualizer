function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return colour;
}

class ListItem{
  value;
  group;
  itemSize = 40;

  constructor(value){
    this.value = value;
  }

  createGroup(color){
    let itemGroup = new Two.Group();
    let rect = two.makeRectangle(0,0,this.itemSize,this.itemSize);
    rect.fill = colourNameToHex(color);
    rect.stroke = colourNameToHex("white");
    rect.linewidth = 2;
    itemGroup.add(rect);

    let text = new Two.Text(this.value, 0,0);
    itemGroup.add(text);

    this.group = itemGroup;
  }
}

class ListAnimator{
  items = [];
  extraGroups = [];
  captions = {};
  itemColor = 'DarkGray';
  maxFillRatio = 0.7;
  static availableAnimations={
    'set items':{'items':'list of items or variable name'},
    'swap':{'index 1':'index of first item','index 2':'index of second item'},
    'highlight':{'index(es)':'the index of an item or list of indices to highlight','color':'css color of the highlight'},
    'remove highlight':{'index(es)':'the index of an item or list of indices to remove highlights'},
    'append':{'value':'value to append to the list'},
    'insert':{'index':'index of the item to be inserted','value':'value of the item inserted'},
    'remove':{'index':'index of the item to remove'},
    'replace':{'index':'index of the item to replace','value':'value of the new item'},
    'caption':{'name':'name of the caption','value':'value of the caption'},
    'marker':{'index':'add marker to the right of the item at index'}};

  createListGroups(){
    let padding = 20;
    let currentx = 0;

    this.items.forEach(item => {
      item.createGroup(this.itemColor);
      item.group.translation.set(currentx,item.itemSize/2);
      currentx += item.itemSize + padding;
    })
  }

  draw(){
    two.clear();

    let group = new Two.Group();

    this.items.forEach((item) => {
      group.add(item.group);
    });

    group.add(this.extraGroups);

    let bound = group.getBoundingClientRect(false);

    if(bound.width > two.width*this.maxFillRatio){
      console.log("scale")
      group.scale *= 1/(bound.width/(two.width*this.maxFillRatio))
    }

    bound = group.getBoundingClientRect(false);
    group.translation.set((two.width/2 - bound.width/2 -20), (two.height/2  -40))

    two.add(group);
    two.add(this.createCaptionGroups())
    two.update();
  }

  createCaptionGroups(){
    let group = new Two.Group();
    let y = 0;
    for (const [key, value] of Object.entries(this.captions)) {
      let string = key + ": " + value;

      let text = new Two.Text(string, 0,y);
      text.size = 15;
      text.fill = colourNameToHex('white');
      text.alignment = 'left';
      let bounds = text.getBoundingClientRect(true);

      y += bounds.height + 5;
      group.add(text);
    }

    let bounds = group.getBoundingClientRect(true);
    group.translation.set(two.width-bounds.width,two.height-bounds.height-20);
    return group;
  }

  async caption(name,values){
    this.captions[name] = values;
    this.draw();
  }

  async setItems(items){
    this.items = [];
    items.forEach((item) => {
      this.items.push(new ListItem(item))
    })
    this.createListGroups();
    this.draw();
    await sleep(1000);
  }

  async swap(i,j){
    two.frameCount = 0;

    let iGroup = this.items[i].group;
    let jGroup = this.items[j].group;

    let radius = (jGroup.translation.x - iGroup.translation.x)/2;
    let center = [iGroup.translation.x + radius,iGroup.translation.y];
    let iAngle = 180;
    let jAngle = 0;
    let delta = 2;
    let frames = 180/delta;

    function animate(){
      iGroup.translation.set(center[0]+(Math.cos(degrees_to_radians(iAngle))*radius),
                            center[1]+Math.sin(degrees_to_radians(iAngle))*radius);

      jGroup.translation.set(center[0]+(Math.cos(degrees_to_radians(jAngle))*radius),
                            center[1]+Math.sin(degrees_to_radians(jAngle))*radius);

      iAngle -= delta;
      jAngle -= delta;

      two.update();
    }

    for (let i = 0; i<=frames; i++){
      await sleep(15);
      animate();
    }

    let temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;

    await sleep(250);

  }

  async highlight(index,color){
    if(typeof index == 'object'){
      for(let i = 0; i<=index.length-1; i++){
        this.items[index[i]].group.children[0].fill = colourNameToHex(color);
      }
    }
    else{
      this.items[index].group.children[0].fill = colourNameToHex(color);
    }

    two.update();
    await sleep(1000);
  }

  async removeHighlight(index){
    await this.highlight(index,this.itemColor);
  }

  async append(item){
    this.items.push(new ListItem(item));
    this.createListGroups();
    let appended = this.items[this.items.length-1].group
    appended.opacity = 0;
    this.draw();

    let frames = 30;
    let delta = 1/frames;

    function animate(){
      appended.opacity += delta;
      two.update();
    }

    for (let i = 0; i<frames; i++){
      await sleep(15);
      animate();
    }

    await sleep(1000);
  }

  async addMarker(index){
    var rect = two.makeRectangle(0,0,5,60);
    rect.fill = colourNameToHex('white');
    rect.opacity = 0;
    rect.noStroke();
    var targetItemBounds = this.items[index].group.getBoundingClientRect(true);
    var targetItemPosition = this.items[index].group.translation;
    rect.translation.set(targetItemPosition.x + targetItemBounds.width/2 + 7 , targetItemPosition.y);
    this.extraGroups.push(rect);
    this.draw();

    let frames = 20;
    let delta = 1/frames;

    function animate(){
      rect.opacity += delta;
      two.update();
    }

    for (let i = 0; i<=frames; i++){
      await sleep(15);
      animate();
    }

    await sleep(1000)
  }

  async removeMarker(index){

  }

  async insert(index, item){
    this.items.splice(index, 0, new ListItem(item));
    this.createListGroups();
    let inserted = this.items[index].group
    inserted.translation.set(inserted.translation.x,inserted.translation.y - 35)
    inserted.opacity = 0;
    this.draw();

    let frames = 30;
    let delta = 1/frames;

    function animate(){
      inserted.opacity += delta;
      inserted.translation.set(inserted.translation.x,inserted.translation.y + 35*delta)
      two.update();
    }

    for (let i = 0; i<frames; i++){
      await sleep(15);
      animate();
    }

    await sleep(1000);
  }

  async remove(index){
    let toRemove = this.items[index].group
    let frames = 30;
    let delta = 1/frames;

    function animate(){
      toRemove.opacity -= delta;
      toRemove.translation.set(toRemove.translation.x,toRemove.translation.y - 35*delta)
      two.update();
    }

    for (let i = 0; i<frames; i++){
      await sleep(15);
      animate();
    }

    this.items.splice(index, 1);
    this.createListGroups();
    this.draw();

    await sleep(1000)
  }

  async replace(index, newValue){
    let newItem = new ListItem(newValue);
    let distance = 50;
    newItem.createGroup(this.itemColor);
    let currentItem = this.items[index].group
    newItem.group.translation.set(currentItem.translation.x,currentItem.translation.y - distance);
    newItem.group.opacity = 0;

    this.items.push(newItem);
    this.draw()


    let frames = 30;
    let delta = 1/frames;

    function animate(){
      currentItem.opacity -= delta;
      newItem.group.opacity += delta;
      currentItem.translation.set(currentItem.translation.x,currentItem.translation.y + distance*delta)
      newItem.group.translation.set(newItem.group.translation.x,newItem.group.translation.y + distance*delta)
      two.update();
    }

    for (let i = 0; i<frames; i++){
      await sleep(15);
      animate();
    }

    this.items[index] = newItem;
    this.items.pop();
    this.createListGroups();
    this.draw();

    await sleep(1000)

  }
}