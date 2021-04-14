var myInterpreter;
var animationList = [];
var createdAnimations = {};
var two;
var editor;
var running = false;
var userDemonstrations;

class CreatedAnimation{
  animationName;
  hasElse;
  params;
}

class Demonstration{
  code;
  animations;
  type;
  name;
}

function init(){

  changeAvailableAnimations();
  changeSelectedAnimation();
  updateDemonstrations();
  updateLoaded(false);

  editor = ace.edit("editor");
  editor.setOptions({
    fontSize: "12pt",
    theme: "ace/theme/tomorrow_night",
    useWorker: false,
    mode: "ace/mode/javascript",
    enableLiveAutocompletion: true,
    showPrintMargin: false,
  });

  editor.on("guttermousedown", function(e){
    let target = e.domEvent.target;
    if (target.className.indexOf("ace_gutter-cell") == -1)
    return;
    if (e.clientX > 25 + target.getBoundingClientRect().left)
    return;

    let row = e.getDocumentPosition().row;
    e.stop()

    let animationTab = document.getElementById("addAnimationTab");
    animationTab.click();

    let animationTabContent = document.getElementById("addAnimation");
    animationTabContent.style.borderColor = "rgba(255,255,255,1)"

    document.getElementById("lineNumber").value = row + 1;

    let id = setInterval(frame, 5);

    function frame() {
      let animationTabContent = document.getElementById("addAnimation");
      let color = animationTabContent.style.borderColor
      color = color.substring(color.indexOf('(')+1, color.indexOf(')'));
      color = color.split(',', 3);
      let r = parseInt(color[0]) - 1;
      let g = parseInt(color[1]) - 1;
      let b = parseInt(color[2]) - 1;

      if (r < 30 || g < 30 || b < 30) {
        animationTabContent.style.borderColor = "#16191B";
        clearInterval(id);
      } else {
        animationTabContent.style.borderColor = "rgb("+r+","+g+","+b+")"
      }
    }
  })

  //add tooltips for animation labels

  //delete demonstration

  //adding name to demo

  //loading admin animations

  //alert when changing animation type when animations already exist

  //add else statement thing
}

function objectToArray(object){
  let newObject = object;
  if(object != undefined){
    if (object.class == 'Array') {
      newObject = Object.values(object.properties);
      newObject.forEach((item, i) => {
        newObject[i] = objectToArray(item);
      });
    }
  }
  return newObject;
}

function updateRunning(){
  if(running){
    let run = document.getElementById('runButton');
    run.disabled = false;
    run.innerHTML = 'Reset'
    document.getElementById('stepButton').disabled = true;
    document.getElementById('loadButton').disabled = true;

  }
  else{
    let run = document.getElementById('runButton');
    run.innerHTML = 'Run'
    run.disabled = false;
    document.getElementById('stepButton').disabled = false;
    document.getElementById('loadButton').disabled = false;
  }
}

function updateLoaded(loaded){
  if(loaded){
    let run = document.getElementById('runButton');
    run.disabled = false;
    run.innerHTML = 'Run'
    document.getElementById('stepButton').disabled = false;
    document.getElementById('loadButton').disabled = false;

  }
  else{
    let run = document.getElementById('runButton');
    run.disabled = true;
    run.innerHTML = 'Run'
    document.getElementById('stepButton').disabled = true;
    document.getElementById('loadButton').disabled = false;
  }
}

function updateDemonstrations(){

  console.log(userDemonstrations.length)
  let usermadeDiv = document.getElementById('usermade');
  usermadeDiv.innerHTML='';
  userDemonstrations.forEach((item, i) => {
    let animation = JSON.parse(item.fields.animations);

    let button = document.createElement('button')
    button.setAttribute('class','demoButton')
    button.setAttribute('onclick','loadDemonstration('+ item.fields.animations +')')
    button.innerHTML = animation.name;

    usermadeDiv.appendChild(button);
  });




  //console.log(JSON.parse(usermadeAnimations));

  // premadeKeys.forEach((item, i) => {
  //   let premadeDiv = document.getElementById('premade');
  //
  //   let button = document.createElement('button')
  //   button.setAttribute('class','demoButton')
  //   button.setAttribute('onclick','loadDemonstration('+ premade[item].serialized +')')
  //   button.innerHTML = premade[item].name;
  //
  //   premadeDiv.appendChild(button);
  // });
  //
  // let usermadeKeys = Object.keys(usermade);
  //
  // usermadeKeys.forEach((item, i) => {
  //   let usermadeDiv = document.getElementById('usermade');
  //
  //   let button = document.createElement('button')
  //   button.setAttribute('class','demoButton')
  //   button.setAttribute('onclick','loadDemonstration('+ usermade[item].serialized +')')
  //   button.innerHTML = usermade[item].name;
  //
  //   usermadeDiv.appendChild(button);
  // });

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function addDemonstration(){
  let demo = new Object();
  demo.code = editor.session.getValue();
  demo.animations = createdAnimations;
  demo.type = document.getElementById('dataStructures').value;
  demo.name = 'test';

  userDemonstrations.push(demo);
  console.log(userDemonstrations)
  console.log(demo)
  saveDemonstration(demo);
}

function saveDemonstration(demo){

  let serialized = JSON.stringify(demo);

  let request = new XMLHttpRequest();

  console.log(serialized)

  let data = encodeURIComponent( 'serialized' ) + '=' + encodeURIComponent( serialized )
  let urlData = data.replace( /%20/g, '+' );

  request.addEventListener( 'error', function(event) {
    alert( 'Error' );
  } );

  request.addEventListener( 'load', function(event) {
    userDemonstrations = JSON.parse(JSON.parse(this.responseText).databaseAnimations);
    updateDemonstrations();
  } );

  request.open( 'POST', 'http://127.0.0.1:8000/saveAnimation');

  request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');

  request.setRequestHeader('X-CSRFToken',getCookie('csrftoken'))

  request.send(urlData);
}

function loadDemonstration(serialized){
  createdAnimations = serialized.animations;
  editor.session.setValue(serialized.code);
  document.getElementById('dataStructures').value = serialized.type;

  updateBreakpoints();
  updateAddedAnimations();
}

function updateBreakpoints(){
  editor.session.clearBreakpoints();

  let keys = Object.keys(createdAnimations);

  keys.forEach((item, i) => {
    editor.session.setBreakpoint(parseInt(item) - 1);
  });

}

function addAnimationsToCode(){
  let code = ''

  let type = document.getElementById('dataStructures').value;
  code += 'createAnimation(\'type\',\''+ type +'\');'

  for(let i = 0; i < editor.session.getLength(); i++){
    code += editor.session.getLine(i);
    let lineAnimations = createdAnimations[i+1];
    if(lineAnimations != undefined){
      lineAnimations.forEach((item) => {
        let paramString = ''
        item.params.forEach((item) => {
          if(item == ''){
            item = 'undefined';
          }
          paramString += ','+item;
        });

        let animationFunction = ';createAnimation(\'' + item.animationName+ '\'' + paramString + ');'
        code += animationFunction;
      });
    }
    code += '\n'
  }

  return code;

}

function updateAddedAnimations(){
  let createdAnimationsDiv = document.getElementById('createdAnimations')
  createdAnimationsDiv.innerHTML = '';

  let lines = Object.keys(createdAnimations);
  lines.forEach((item) => {

    lineAnimations = createdAnimations[item];

    lineAnimations.forEach((animation,i) => {
      let newDiv = document.createElement('div');
      newDiv.setAttribute('class','createdAnimation');

      let newP = document.createElement('p')
      let pContent = 'Animation: ' + animation.animationName + ' - Line: ' + item;
      newP.innerHTML = pContent;

      let newButton = document.createElement('button')
      newButton.setAttribute('class','animationButton');
      newButton.setAttribute('onclick','removeAnimation('+item+','+i+')');
      newButton.innerHTML = '&#10006;';

      newDiv.appendChild(newP);
      newDiv.appendChild(newButton);

      createdAnimationsDiv.appendChild(newDiv);
    });
  });

}

function changeAvailableAnimations(){
  let selectedAnimator = document.getElementById('dataStructures').value;
  let availableAnimations = [];
  if (selectedAnimator == 'list'){
    availableAnimations = Object.keys(ListAnimator.availableAnimations);
  }
  else if (selectedAnimator == 'plot') {
    availableAnimations = Object.keys(PlottingAnimator.availableAnimations);
  }
  else if(selectedAnimator == 'graph'){
    availableAnimations = Object.keys(GraphAnimator.availableAnimations);
  }

  let innerString = '';
  availableAnimations.forEach((item) => {
    innerString += '<option>' + item + '</option>'
  });

  document.getElementById('selectedAnimation').innerHTML = innerString;

  changeSelectedAnimation();

}

function changeSelectedAnimation(){
  let paramDiv = document.getElementById('params');
  paramDiv.innerHTML = '';
  let selectedAnimation = document.getElementById('selectedAnimation').value;
  let selectedAnimator = document.getElementById('dataStructures').value;
  let params;

  if (selectedAnimator == 'list'){
    params = ListAnimator.availableAnimations[selectedAnimation];
  }
  else if (selectedAnimator == 'plot') {
    params = PlottingAnimator.availableAnimations[selectedAnimation];
  }
  else if(selectedAnimator == 'graph'){
    params = GraphAnimator.availableAnimations[selectedAnimation];
  }

  keys = Object.keys(params);

  keys.forEach((item,i) => {
    let itemName = 'param'+i
    let description = params[item];

    let newlabel = document.createElement('label')
    newlabel.setAttribute('for',itemName);
    newlabel.innerHTML = item + ": ";
    let newinput = document.createElement('input')
    newinput.setAttribute('class','textInput');
    newinput.setAttribute('type','text');
    newinput.setAttribute('name',itemName);
    newinput.setAttribute('id',itemName);

    paramDiv.appendChild(newlabel);
    paramDiv.appendChild(newinput)

  });

}

function addAnimation(){
  let newAnimation = new CreatedAnimation();
  let lineNumber = document.getElementById("lineNumber").value;
  let selectedAnimation = document.getElementById("selectedAnimation").value;
  newAnimation.animationName = selectedAnimation;
  newAnimation.hasElse = document.getElementById('hasElse').checked;
  let selectedAnimator = document.getElementById('dataStructures').value;
  let paramCount;

  if (selectedAnimator == 'list'){
    paramCount = Object.keys(ListAnimator.availableAnimations[selectedAnimation]).length;
  }
  else if (selectedAnimator == 'plot') {
    paramCount = Object.keys(PlottingAnimator.availableAnimations[selectedAnimation]).length;
  }
  else if (selectedAnimator == 'graph') {
    paramCount = Object.keys(GraphAnimator.availableAnimations[selectedAnimation]).length;
  }

  let params = [];

  for(let i = 0; i<paramCount;i++){
    params.push(document.getElementById('param'+i).value)
  }

  newAnimation.params = params;
  console.log(params)

  if(createdAnimations[lineNumber] == undefined){
    createdAnimations[lineNumber] = [];
  }
  createdAnimations[lineNumber].push(newAnimation);

  let animationTab = document.getElementById("animationTab");
  animationTab.click();

  updateAddedAnimations();
  updateBreakpoints();
}

function removeAnimation(line,index){
  createdAnimations[line].splice(index,1);
  console.log(createdAnimations[line])
  if(createdAnimations[line].length == 0){
    delete createdAnimations[line];
  }
  updateAddedAnimations();
  updateBreakpoints();
}

function openTab(evt, tab) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " active";
}

function load(){
  let selectedAnimator = document.getElementById('dataStructures').value;
  let elem = document.getElementById('draw-shapes');
  elem.innerHTML = '';

  if(selectedAnimator == 'list' || selectedAnimator == 'graph'){
    let elem = document.getElementById('draw-shapes');
    two = new Two({ width: elem.offsetWidth, height: elem.offsetHeight }).appendTo(elem);
  }

  let code = addAnimationsToCode();
  myInterpreter = new Interpreter(code,initFunc);
  animationList = [];
  myInterpreter.run();
  updateLoaded(true);
}

function nextStep() {
  if (myInterpreter.step()) {
    window.setTimeout(nextStep, 0);
  }
}

function step(){
  console.log(myInterpreter.step());
}

async function execute(){

  updateRunning();
  if(!running){
    return;
  }

  let animator;

  if(animationList[0][0] == 'type'){
    switch (animationList[0][1]) {
      case 'list': animator = new ListAnimator(); break;
      case 'plot':  animator = new PlottingAnimator(); break;
      case 'graph':  animator = new GraphAnimator(); break;
    }
  }
  else{
    console.log("first animation must specify data structure");
    return;
  }

  for (let i = 1; i < animationList.length; i++){
    switch (animationList[i][0]) {
      case 'set items':  await animator.setItems(animationList[i][1],animationList[i][2]); break;
      case 'swap':  await animator.swap(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'highlight': await animator.highlight(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'remove highlight': await animator.removeHighlight(animationList[i][1],animationList[i][2]); break;
      case 'append': await animator.append(animationList[i][1],animationList[i][2]); break;
      case 'insert': await animator.insert(animationList[i][1],animationList[i][2],animationList[i][3]);break;
      case 'remove': await animator.remove(animationList[i][1],animationList[i][2]);break;
      case 'replace': await animator.replace(animationList[i][1],animationList[i][2],animationList[i][3]);break;
      case 'caption': await animator.caption(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'marker': await animator.addMarker(animationList[i][1],animationList[i][2]); break;
      case 'remove marker': await animator.removeMarker(animationList[i][1],animationList[i][2]); break;
      case 'plot function': await animator.plotFunction(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'plot points': await animator.plotPoints(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'clear plot': await animator.clearPlot(animationList[i][1]); break;
      case 'evaluate': await animator.evaluateFunction(animationList[i][1],animationList[i][2],animationList[i][3],animationList[i][4]);break;
      case 'plot two point line': await animator.twoPointLine(animationList[i][1],animationList[i][2],animationList[i][3],animationList[i][4]);break;
      case 'set graph': await animator.setGraph(animationList[i][1],animationList[i][2],animationList[i][3],animationList[i][4]);break;
      case 'highlight node': await animator.highlightNode(animationList[i][1],animationList[i][2],animationList[i][3]);break
      case 'highlight edge': await animator.highlightEdge(animationList[i][1],animationList[i][2],animationList[i][3]); break;
      case 'remove edge highlight': await animator.removeHighlightEdge(animationList[i][1],animationList[i][2]);break
      case 'remove node highlight': await animator.removeHighlightNode(animationList[i][1],animationList[i][2]);break
      case 'transition': await animator.transition(animationList[i][1],animationList[i][2],animationList[i][3],animationList[i][4]);break
      default: console.log(animationList[i][0] + ' is not an animation')
    }

    if(!running){
      updateRunning();
      return;
    }
  }

  running = false;
  updateRunning();
}

function createAnimation(animation){
  for(let i = 0;i < animation.length; i++){
    animation[i] = objectToArray(animation[i]);
  }

  animationList.push(animation);
}

function initFunc(interpreter, globalObject){

  //alert()
  var alertWrapper = function(text){
    return alert(arguments.length ? text : '');
  };
  interpreter.setProperty(globalObject,'alert',interpreter.createNativeFunction(alertWrapper));

  //console.log()
  var consoleWrapper = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, 'console', consoleWrapper);

  var logWrapper = function(text) {
    return console.log(text);
  };
  interpreter.setProperty(consoleWrapper, 'log',interpreter.createNativeFunction(logWrapper));

  //createAnimation()
  var animationWrapper = function(){
    createAnimation(arguments)
  };
  interpreter.setProperty(globalObject,'createAnimation',interpreter.createNativeFunction(animationWrapper));

}
