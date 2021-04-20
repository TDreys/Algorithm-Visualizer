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

var timeStep = 2;

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
    'set items':{desc:'change the displayed list to the given items',params:{'items':'list of items or variable name','pause':'time between this animation and the next in milliseconds'}},
    'swap':{desc:'swap two items in the displayed list',params:{'index 1':'index of first item','index 2':'index of second item','pause':'time between this animation and the next in milliseconds'}},
    'highlight':{desc:'highlight items in a list',params:{'index(es)':'the index of an item or list of indices to highlight','color':'css color of the highlight','pause':'time between this animation and the next in milliseconds'}},
    'remove highlight':{desc:'remove highlights from items',params:{'index(es)':'the index of an item or list of indices to remove highlights','pause':'time between this animation and the next in milliseconds'}},
    'append':{desc:'append an item to the end on the list',params:{'value':'value to append to the list','pause':'time between this animation and the next in milliseconds'}},
    'insert':{desc:'insert an item into the list',params:{'index':'index of the item to be inserted','value':'value of the item inserted','pause':'time between this animation and the next in milliseconds'}},
    'remove':{desc:'remove an item from the list',params:{'index':'index of the item to remove','pause':'time between this animation and the next in milliseconds'}},
    'replace':{desc:'replace an item in the list with a new item',params:{'index':'index of the item to replace','value':'value of the new item','pause':'time between this animation and the next in milliseconds'}},
    'caption':{desc:'add a caption to give more information',params:{'name':'name of the caption','value':'value of the caption','pause':'time between this animation and the next in milliseconds'}},
    'marker':{desc:'add a marker',params:{'index':'add marker to the right of the item at index','pause':'time between this animation and the next in milliseconds'}},
    'remove marker':{desc:'remove a marker',params:{'index':'remove marker to the right of the item at index','pause':'time between this animation and the next in milliseconds'}}};

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

    this.extraGroups.forEach((item, i) => {
      group.add(item.group)
    });

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

  async setItems(items,pause = 1000){
    this.items = [];
    items.forEach((item) => {
      this.items.push(new ListItem(item))
    })
    this.createListGroups();
    this.draw();
    await sleep(pause/timeStep);
  }

  async swap(i,j,pause = 1000){
    two.frameCount = 0;

    let iGroup = this.items[i].group;
    let jGroup = this.items[j].group;

    let radius = (jGroup.translation.x - iGroup.translation.x)/2;
    let center = [iGroup.translation.x + radius,iGroup.translation.y];
    let iAngle = 180;
    let jAngle = 0;
    let frames = Math.floor(60/timeStep);
    let delta = 180/frames;

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

    await sleep(pause/timeStep);

  }

  async highlight(index,color,pause = 1000){
    if(typeof index == 'object'){
      for(let i = 0; i<=index.length-1; i++){
        this.items[index[i]].group.children[0].fill = colourNameToHex(color);
      }
    }
    else{
      this.items[index].group.children[0].fill = colourNameToHex(color);
    }

    two.update();
    await sleep(pause/timeStep);
  }

  async removeHighlight(index,pause){
    await this.highlight(index,this.itemColor,pause);
  }

  async append(item,pause = 1000){
    this.items.push(new ListItem(item));
    this.createListGroups();
    let appended = this.items[this.items.length-1].group
    appended.opacity = 0;
    this.draw();

    let frames = Math.floor(30/timeStep);
    let delta = 1/frames;

    function animate(){
      appended.opacity += delta;
      two.update();
    }

    for (let i = 0; i<frames; i++){
      await sleep(15);
      animate();
    }

    await sleep(pause/timeStep);
  }

  async addMarker(index,pause = 1000){
    let rect = two.makeRectangle(0,0,5,60);
    rect.fill = colourNameToHex('white');
    rect.opacity = 0;
    rect.noStroke();
    let targetItemBounds = this.items[index].group.getBoundingClientRect(true);
    let targetItemPosition = this.items[index].group.translation;
    rect.translation.set(targetItemPosition.x + targetItemBounds.width/2 + 7 , targetItemPosition.y);
    this.extraGroups.push({group:rect,index:index});
    this.draw();

    let frames = Math.floor(20/timeStep);
    let delta = 1/frames;

    function animate(){
      rect.opacity += delta;
      two.update();
    }

    for (let i = 0; i<=frames; i++){
      await sleep(15);
      animate();
    }

    await sleep(pause/timeStep)
  }

  async removeMarker(index,pause = 1000){
    let foundIndex;
    this.extraGroups.forEach((item, i) => {
      if(item.index == index){
        foundIndex = i;
      }
    });

    let frames = Math.floor(20/timeStep);
    let delta = 1/frames;
    let group = this.extraGroups[foundIndex].group;

    function animate(){
      group.opacity -= delta;
      two.update();
    }

    for (let i = 0; i<=frames; i++){
      await sleep(15);
      animate();
    }

    this.extraGroups.splice(foundIndex, 1);

    this.draw();

    await sleep(pause/timeStep)
  }

  async insert(index, item,pause = 1000){
    this.items.splice(index, 0, new ListItem(item));
    this.createListGroups();
    let inserted = this.items[index].group
    inserted.translation.set(inserted.translation.x,inserted.translation.y - 35)
    inserted.opacity = 0;
    this.draw();

    let frames = Math.floor(30/timeStep);
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

    await sleep(pause/timeStep);
  }

  async remove(index,pause = 1000){
    let toRemove = this.items[index].group
    let frames = Math.floor(30/timeStep);
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

    await sleep(pause/timeStep)
  }

  async replace(index, newValue,pause = 1000){
    let newItem = new ListItem(newValue);
    let distance = 50;
    newItem.createGroup(this.itemColor);
    let currentItem = this.items[index].group
    newItem.group.translation.set(currentItem.translation.x,currentItem.translation.y - distance);
    newItem.group.opacity = 0;

    this.items.push(newItem);
    this.draw()


    let frames = Math.floor(30/timeStep);
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

    await sleep(pause/timeStep)

  }
}


class PlottingAnimator{

  options = {
    target: '#draw-shapes',
    width: document.getElementById('draw-shapes').offsetWidth*0.6,
    height: document.getElementById('draw-shapes').offsetHeight,
    grid:true,
    data:[],
  }

  static availableAnimations={
    'plot function':{desc:'plot a function from a given string',params:{'function string':'function to plot','pause':'time between this animation and the next in milliseconds','color':'color of the line'}},
    'plot points':{desc:'plot points onto a plot',params:{'points':'2d list of x,y points','pause':'time between this animation and the next in milliseconds','color':'color of the line'}},
    'clear plot':{desc:'remove all functions and points from a plot',params:{'pause':'time between this animation and the next in milliseconds'}},
    'evaluate':{desc:'display a point by evaluating a function a function at a given x value',params:{'function string':'function to evaluate','x value':'x value to evaluate','pause':'time between this animation and the next in milliseconds','color':'color of the line'}},
    'plot two point line':{desc:'plot a straight line between two points',params:{'point 1':'list with the x and y coordinate','point 2':'list with the x and y coordinate','pause':'time between this animation and the next in milliseconds','color':'color of the line'}},
  };

  drawPlots(){
    functionPlot(this.options)
  }

  async plotFunction(functionString,pause = 0,color){
    this.options.data.push({fn:functionString,color:color})
    this.drawPlots();
    await sleep(pause/timeStep);
  }

  async plotPoints(pointsList,pause = 0,color){

    this.options.data.push({
        fnType: 'points',
        graphType: 'scatter',
        points: pointsList,
        color:color,
      })
    this.drawPlots();

    await sleep(pause/timeStep);
  }

  async clearPlot(pause = 0){
    this.options.data = []
    document.getElementById('draw-shapes').innerHTML = '';
    this.drawPlots();

    await sleep(pause/timeStep);
  }

  async evaluateFunction(functionString,xCoord,pause = 0,color){
    let datum = {fn:functionString, color:color};
    let scope = {x:xCoord}
    let y = functionPlot.$eval.builtIn(datum, 'fn', scope)
    let point = [[xCoord,y]]

    await this.plotPoints(point,pause);
  }

  async twoPointLine(point1,point2,pause = 0,color){
    this.options.data.push({
      fnType: 'points',
      graphType: 'polyline',
      points: [point1,point2],
      color:color,
    })
    this.drawPlots();

    await sleep(pause/timeStep)
  }
}

class GraphAnimator{

  graph = new Springy.Graph();
  nodes = [];
  edges = [];
  transitions = [];
  captions = {};
  layout;
  isDirected = false;
  maxFillRatio = 0.7;
  static availableAnimations={
    'set graph':{desc:'change the displayed graph to the graph given',params:{'graph':'graph to display','type':'type of represenation','directed?':'is the graph directed','pause':'time between this animation and the next in milliseconds'}},
    'highlight node':{desc:'highlight a node on a graph',params:{'node(s)':'index of the node or list of indexes','color':'css color of the highlight','pause':'time between this animation and the next in milliseconds'}},
    'remove node highlight':{desc:'remove the highlights from a node',params:{'node(s)':'index of the node or list of indexes to remove highlight','pause':'time between this animation and the next in milliseconds'}},
    'highlight edge':{desc:'highlight an edge on a graph',params:{'edge(s)':'list of start and end node pairs for the edge i.e [[0,1],[2,3]]','color':'color of the highlight','pause':'time between this animation and the next in milliseconds'}},
    'remove edge highlight':{desc:'remove the highlights from an edge on a graph',params:{'edge(s)':'list of start and end node pairs for the edge i.e [[0,1],[2,3]] to remove highlight from','pause':'time between this animation and the next in milliseconds'}},
    'transition':{desc:'animate a transition between an origin node and connected nodes',params:{'origin':'origin node of the transition','nodes':'list of indexes where the transition goes to','color':'color of the transition','pause':'time between this animation and the next in milliseconds'}},
    'caption':{desc:'add a caption to give more information',params:{'name':'name of the caption','value':'value of the caption','pause':'time between this animation and the next in milliseconds'}},
  };

  generateFromAdjecencyArray(data){
    let newGraph = new Springy.Graph();
    let nodes = []

    data.forEach(() => {
      nodes.push(newGraph.newNode())
    });

    data.forEach((connections, i) => {
      connections.forEach((item, j) => {
        if(Number.isInteger(item)){
          newGraph.newEdge(nodes[i],nodes[item]);
        }
        else {
          newGraph.newEdge(nodes[i],nodes[item[0]],item[1]);
        }
      });
    });

    return newGraph;
  }


  calculateLayout(){
    this.layout = new Springy.Layout.ForceDirected(
      this.graph,
      300.0, // Spring stiffness
      500.0, // Node repulsion
      0.7 // Damping
    );

    for(let i = 0; i< 10000; i++){
      this.layout.tick(0.03);
    }

    let edgesTemp = [];
    let tempDirected = this.isDirected
    this.layout.eachEdge(function(edge,spring){
      let p1 = Object.assign({},spring.point1.p);
      let p2 = Object.assign({},spring.point2.p);
      let group = new Two.Group();
      if(tempDirected){
        let arrowGroup = new Two.Group();
        let vector = [p2.x-p1.x,p2.y-p1.y];
        let perpendicular = [-vector[1],vector[0]];
        let length = Math.sqrt((perpendicular[0] ** 2)+(perpendicular[1] ** 2)) * 5;
        perpendicular = [perpendicular[0]/length,perpendicular[1]/length];
        p1.x = p1.x + perpendicular[0];
        p1.y = p1.y + perpendicular[1];
        p2.x = p2.x + perpendicular[0];
        p2.y = p2.y + perpendicular[1];
        let triangle = two.makePolygon((p2.x-(vector[0]/length*2.3))*50,(p2.y-(vector[1]/length*2.3))*50,7,3);
        triangle.fill = colourNameToHex('white');
        triangle.opacity = 1;
        triangle.rotation = Math.atan2(vector[1]/length,vector[0]/length) - Math.atan2(1,0) + Math.PI;
        let line = two.makeLine(p1.x*50,p1.y*50,p2.x*50,p2.y*50);
        line.stroke = colourNameToHex('white');
        line.opacity = 1;
        arrowGroup.add(line);
        arrowGroup.add(triangle);
        group.add(arrowGroup);
      }
      else {
        let line = two.makeLine(p1.x*50,p1.y*50,p2.x*50,p2.y*50);
        line.stroke = colourNameToHex('white');
        group.add(line);
      }
      let data = '';
      if(typeof edge.data == 'number'){
        data = edge.data
      }
      let text = new Two.Text(data, p1.x*50-(p1.x-p2.x)/2*50,p1.y*50-(p1.y-p2.y)/2*50);
      text.size =23;
      text.fill = colourNameToHex('white')
      group.add(text);
      edgesTemp.push({group:group,start:edge.source.id,end:edge.target.id});
    })
    this.edges = edgesTemp;

    let nodesTemp = [];
    this.layout.eachNode(function(node,point){
      let group = new Two.Group();
      let circle = two.makeCircle(0,0,20);
      circle.fill = colourNameToHex('darkgray');
      group.add(circle);
      let text = new Two.Text(node.id, 0,0);
      text.size = 18;
      group.add(text);
      group.translation.set(point.p.x*50,point.p.y*50)
      nodesTemp.push(group);
    })
    this.nodes = nodesTemp;
  }

  draw(){
    two.clear();
    let group = new Two.Group();

    this.edges.forEach((item) => {
      group.add(item.group);
    });
    this.nodes.forEach((item) => {
      group.add(item);
    });
    this.transitions.forEach((item, i) => {
      group.add(item);
    });


    let bound = group.getBoundingClientRect(false);

    let widthScale = 1/(bound.width/(two.width*this.maxFillRatio))
    let heightScale = 1/(bound.height/(two.height*this.maxFillRatio))
    group.scale = Math.min(widthScale,heightScale);

    bound = group.getBoundingClientRect(false);
    group.translation.set(two.width/2, two.height/2)

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

  async setGraph(graph,directed,pause = 1000){
    this.isDirected = directed;

    this.graph = this.generateFromAdjecencyArray(graph);

    this.calculateLayout();
    this.draw();

    await sleep(pause/timeStep)
  }

  async highlightNode(node,color,pause = 1000){
    if(typeof node == 'object'){
      for(let i = 0; i<=node.length-1; i++){
        this.nodes[node[i]].children[0].fill = colourNameToHex(color);
      }
    }
    else{
      this.nodes[node].children[0].fill = colourNameToHex(color);
    }
    this.draw();

    await sleep(pause/timeStep)
  }

  async removeHighlightNode(node,pause = 1000){
    await this.highlightNode(node,'darkgray',pause)
  }

  async highlightEdge(nodes,color,pause = 1000){
    let directed = this.isDirected;
    nodes.forEach((item, i) => {
      this.edges.forEach((edge, i) => {
        if(directed){
          if((edge.start == item[0] && edge.end == item[1])){
            edge.group.children[0].fill = colourNameToHex(color);
            edge.group.children[0].stroke = colourNameToHex(color);
          }
        }
        else{
          if((edge.start == item[0] && edge.end == item[1]) || (edge.start == item[1] && edge.end == item[0])){
            edge.group.children[0].fill = colourNameToHex(color);
            edge.group.children[0].stroke = colourNameToHex(color);
          }
        }
      });
    });
    this.draw();

    await sleep(pause/timeStep);
  }

  async removeHighlightEdge(nodes,pause = 1000){
    await this.highlightEdge(nodes,'white',pause)
  }

  async transition(root,nodes,color,pause = 1000){
    let initialx = this.nodes[root].translation.x;
    let initialy = this.nodes[root].translation.y;

    let transitions = []

    nodes.forEach((item, i) => {
      let finalx = this.nodes[item].translation.x;
      let finaly = this.nodes[item].translation.y;

      let xvec = finalx - initialx;
      let yvec = finaly - initialy;

      let angle = Math.atan2(yvec,xvec);
      let initialoffsetX = Math.cos(angle)*20
      let initialoffsetY = Math.sin(angle)*20

      xvec = (finalx - initialoffsetX) - (initialx + initialoffsetX)
      yvec = (finaly - initialoffsetY) - (initialy + initialoffsetY)

      let bubble = {
        startx:(initialx + initialoffsetX),
        starty:(initialy + initialoffsetY),
        currentx:(initialx + initialoffsetX),
        currenty:(initialy + initialoffsetY),
        xvec:xvec,
        yvec:yvec
      }

      transitions.push(bubble)
    });

    var frames = Math.floor(60/timeStep);

    function animate(){
      let groups = []
      transitions.forEach((item, i) => {
        let group = new Two.Group();
        let circle = two.makeCircle(item.currentx,item.currenty,5);
        circle.fill = colourNameToHex(color);
        group.add(circle);

        let line = two.makeLine(item.startx,item.starty,item.currentx,item.currenty);
        line.stroke = colourNameToHex(color);
        line.linewidth = 5;
        group.add(line)

        item.currentx += item.xvec/frames
        item.currenty += item.yvec/frames

        groups.push(group)
      });

      return groups;
    }

    for (let i = 0; i<=frames; i++){
      await sleep(15);
      this.transitions = animate();
      this.draw();
    }

    await sleep(pause/timeStep)
    this.transitions = []
    this.draw();
  }
}
