var myInterpreter;
var animationList = [];
var createdAnimations = {};
var two;
var editor;

class CreatedAnimation{
  animationName;
  hasElse;
  params;
}

function init(){

  changeAvailableAnimations();
  changeSelectedAnimation();

  var elem = document.getElementById('draw-shapes');
  two = new Two({ width: elem.offsetWidth, height: elem.offsetHeight }).appendTo(elem);

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
    var target = e.domEvent.target;
    if (target.className.indexOf("ace_gutter-cell") == -1)
    return;
    if (!editor.isFocused())
    return;
    if (e.clientX > 25 + target.getBoundingClientRect().left)
    return;

    var breakpoints = e.editor.session.getBreakpoints(row, 0);
    var row = e.getDocumentPosition().row;

    //If there's a breakpoint already defined, it should be removed, offering the toggle feature
    if(typeof breakpoints[row] === typeof undefined){
        e.editor.session.setBreakpoint(row);
    }else{
        e.editor.session.clearBreakpoint(row);
    }
    e.stop()

    let animationTab = document.getElementById("addAnimationTab");
    animationTab.click();

    let animationTabContent = document.getElementById("addAnimation");
    animationTabContent.style.borderColor = "rgba(255,255,255,1)"

    document.getElementById("lineNumber").value = row + 1;

    var id = setInterval(frame, 5);

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

  //add breakpoint for existing animations not when clicked
  //add event for newline and update animation line numbers

  //add tooltips for animation labels

  //update changeInputContent
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
          paramString += ','+item;
        });

        let animationFunction = 'createAnimation(\'' + item.animationName+ '\'' + paramString + ');'
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

    lineAnimations.forEach((animation) => {
      let newDiv = document.createElement('div');
      newDiv.setAttribute('class','createdAnimation');

      let newP = document.createElement('p')
      let pContent = 'Animation: ' + animation.animationName + ' - Line: ' + item;
      newP.innerHTML = pContent;

      let newButton = document.createElement('button')
      newButton.setAttribute('class','animationButton');
      newButton.innerHTML = 'Edit: &#9998;';

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

  let innerString = '';
  availableAnimations.forEach((item) => {
    innerString += '<option>' + item + '</option>'
  });

  document.getElementById('selectedAnimation').innerHTML = innerString;

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

  keys = Object.keys(params);

  keys.forEach((item,i) => {
    let itemName = 'param'+i
    let description = params[item];

    let newlabel = document.createElement('label')
    newlabel.setAttribute('for',itemName);
    newlabel.innerHTML = item + ": ";
    let newinput = document.createElement('input')
    newinput.setAttribute('class','param');
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
  let paramCount = Object.keys(ListAnimator.availableAnimations[selectedAnimation]).length;
  let params = [];

  for(let i = 0; i<paramCount;i++){
    params.push(document.getElementById('param'+i).value)
  }

  newAnimation.params = params;

  if(createdAnimations[lineNumber] == undefined){
    createdAnimations[lineNumber] = [];
  }
  createdAnimations[lineNumber].push(newAnimation);

  let animationTab = document.getElementById("animationTab");
  animationTab.click();

  updateAddedAnimations();
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
  let code = addAnimationsToCode();
  console.log(code);
  myInterpreter = new Interpreter(code,initFunc);
  animationList = [];
  myInterpreter.run();
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

  let animator;

  if(animationList[0][0] == 'type'){
    switch (animationList[0][1]) {
      case 'list': animator = new ListAnimator(); break;
      case 'tree':  break;
      case 'graph':  break;
    }

  }
  else{
    console.log("first animation must specify data structure");
    return;
  }

  for (let i = 1; i < animationList.length; i++){
    switch (animationList[i][0]) {
      case 'set items':  await animator.setItems(animationList[i][1]); break;
      case 'swap':  await animator.swap(animationList[i][1],animationList[i][2]); break;
      case 'highlight': await animator.highlight(animationList[i][1],animationList[i][2]); break;
      case 'remove highlight': await animator.removeHighlight(animationList[i][1]); break;
      case 'append': await animator.append(animationList[i][1]); break;
      case 'insert': await animator.insert(animationList[i][1],animationList[i][2]);break;
      case 'remove': await animator.remove(animationList[i][1]);break;
      case 'replace': await animator.replace(animationList[i][1],animationList[i][2]);break;
      case 'caption': await animator.caption(animationList[i][1],animationList[i][2]); break;
      case 'marker': await animator.addMarker(animationList[i][1]); break;
      //add remove marker
    }
  }
}

function createAnimation(animation){
  for(let i = 0;i < animation.length; i++){
    if(typeof animation[i] == 'object'){
      animation[i] = Object.values(Object.values(animation[i])[2])
    }
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
