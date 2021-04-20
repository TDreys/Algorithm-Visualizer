var myInterpreter;
var animator;
var animationList = [];
var currentAnimationIndex = 0;
var createdAnimations = {};
var two;
var editor;
var running = false;
var isAnimating = false;
var userDemonstrations;
var adminDemonstrations;

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

  let animationTypeSelect = document.getElementById('dataStructures');
  animationTypeSelect.onchange = function(){
    if(Object.keys(createdAnimations).length){
      if(confirm('Changing the animation type will remove existing animations, do you want to continue?')){
        createdAnimations = {};
        updateAddedAnimations();
      }
    }
    changeAvailableAnimations();
  }

  let runButton = document.getElementById('runButton')
  runButton.onclick = function(){
    running = !running;
    updateRunning();
    execute();
  }

  let stepButton = document.getElementById('stepButton')
  stepButton.onclick = async function(){
    isAnimating= true;
    updateIsAnimating();
    await step(currentAnimationIndex);
    currentAnimationIndex++;
    updateIsAnimating();
  }

  let timeStepRange = document.getElementById('timeStepRange')
  timeStepRange.onchange = function(){
    timeStep = this.value
  }

  let consoleArea = document.getElementById('consoleArea')
  consoleArea.readOnly = true;

  createHowToPage();

  let docTab = document.getElementById('docTab')
  docTab.click();
}

function createHowToPage(){
  let animationDocs = document.getElementById('animationDocs')

  let listheading = document.createElement('h2')
  listheading.innerHTML = 'List Animations';
  animationDocs.appendChild(listheading)
  for(let [key,value] of Object.entries(ListAnimator.availableAnimations)){
    animationDocs.appendChild(createAnimationDoc(key,value))
  }

  let graphheading = document.createElement('h2')
  graphheading.innerHTML = 'Graph Animations';
  animationDocs.appendChild(graphheading)

  for(let [key,value] of Object.entries(GraphAnimator.availableAnimations)){
    animationDocs.appendChild(createAnimationDoc(key,value))
  }

  let plotheading = document.createElement('h2')
  plotheading.innerHTML = 'Plotting Animations';
  animationDocs.appendChild(plotheading)
  for(let [key,value] of Object.entries(PlottingAnimator.availableAnimations)){
    animationDocs.appendChild(createAnimationDoc(key,value))
  }
}

function createAnimationDoc(name,info){
  let div = document.createElement('div')
  div.setAttribute('class','animationDoc')

  let heading = document.createElement('h3')
  let headingString = name.charAt(0).toUpperCase() + name.slice(1);
  heading.innerHTML = headingString;

  let description = document.createElement('p')
  description.innerHTML = info.desc;

  let paramHeading = document.createElement('h4')
  paramHeading.innerHTML = 'Parameters';

  let params = document.createElement('ul')

  for(let [paramname,description] of Object.entries(info.params)){
    let listItem = document.createElement('li');
    listItem.innerHTML = paramname +': ' + description;
    params.appendChild(listItem);
  }

  div.appendChild(heading);
  div.appendChild(description);
  div.appendChild(paramHeading);
  div.appendChild(params);

  return div;
}

function writeToConsole(text){
  let consoleArea = document.getElementById('consoleArea')
  consoleArea.value += text + '\n';
  consoleArea.scrollTop = consoleArea.scrollHeight;
}

function clearConsole(){
  let consoleArea = document.getElementById('consoleArea')
  consoleArea.value = '';
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

function moveCreatedAnimation(up,line,index){
  let lineAnimations = createdAnimations[line];
  if(up){
    if(index != 0){
      let temp = lineAnimations[index-1]
      lineAnimations[index-1] = lineAnimations[index]
      lineAnimations[index] = temp;
    }
  }
  else{
    if(index != lineAnimations.length-1){
      let temp = lineAnimations[index+1]
      lineAnimations[index+1] = lineAnimations[index]
      lineAnimations[index] = temp;
    }
  }

  updateAddedAnimations();
}

function updateIsAnimating(){
  if(isAnimating){
    document.getElementById('runButton').disabled = true;
    document.getElementById('stepButton').disabled = true;
    document.getElementById('loadButton').disabled = true;

  }
  else{
    document.getElementById('runButton').disabled = false;
    document.getElementById('stepButton').disabled = false;
    document.getElementById('loadButton').disabled = false;
  }
}

function updateRunning(){
  if(running){
    let run = document.getElementById('runButton');
    run.disabled = false;
    run.innerHTML = 'Pause'
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

  let usermadeDiv = document.getElementById('usermade');
  usermadeDiv.innerHTML='';
  userDemonstrations.forEach((item, i) => {
    let demo = JSON.parse(item.fields.animations);

    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class','buttonDiv')

    let button = document.createElement('button')
    button.setAttribute('class','demoButton')
    button.setAttribute('onclick','loadDemonstration('+ item.fields.animations +')')
    button.innerHTML = demo.name;

    let deleteButton = document.createElement('button')
    deleteButton.setAttribute('class','deleteButton');
    deleteButton.setAttribute('onclick','deleteDemonstration('+item.pk+')');
    deleteButton.innerHTML = '&#10006;';

    buttonDiv.appendChild(button)
    buttonDiv.appendChild(deleteButton);
    usermadeDiv.appendChild(buttonDiv);
  });

  let premadeDiv = document.getElementById('premade');
  premadeDiv.innerHTML = '';

  adminDemonstrations.forEach((item, i) => {
    let demo = JSON.parse(item.fields.animations);

    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class','buttonDiv')
    let button = document.createElement('button')
    button.setAttribute('class','demoButton')
    button.setAttribute('onclick','loadDemonstration('+ item.fields.animations +')')
    button.innerHTML = demo.name;

    buttonDiv.appendChild(button);
    premadeDiv.appendChild(buttonDiv);
  });
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
  demo.name = document.getElementById('demoName').value;

  userDemonstrations.push(demo);
  console.log(userDemonstrations)
  console.log(demo)
  saveDemonstration(demo);
}

function deleteDemonstration(pk){
  let confirmation = confirm('Are you sure you want to delete this demonstration?')

  if(confirmation){
    let request = new XMLHttpRequest();

    request.addEventListener( 'error', function(event) {
      alert( 'Error' );
    } );

    request.addEventListener( 'load', function(event) {
      userDemonstrations = JSON.parse(JSON.parse(this.responseText).databaseAnimations);
      updateDemonstrations();
    } );

    request.open( 'POST', window.location.href+'deleteDemonstration');

    request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');

    request.setRequestHeader('X-CSRFToken',getCookie('csrftoken'))

    request.send('pk='+pk);
  }
}

function saveDemonstration(demo){

  let serialized = JSON.stringify(demo);

  let request = new XMLHttpRequest();

  let data = encodeURIComponent( 'serialized' ) + '=' + encodeURIComponent( serialized )
  let urlData = data.replace( /%20/g, '+' );

  request.addEventListener( 'error', function(event) {
    alert( 'Error' );
  } );

  request.addEventListener( 'load', function(event) {
    userDemonstrations = JSON.parse(JSON.parse(this.responseText).databaseAnimations);
    updateDemonstrations();
    let demoTab = document.getElementById('demoSelectorTab')
    demoTab.click();
  } );

  request.open( 'POST', window.location.href+'saveDemonstration');

  request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');

  request.setRequestHeader('X-CSRFToken',getCookie('csrftoken'))

  request.send(urlData);
}

function loadDemonstration(serialized){
  createdAnimations = serialized.animations;
  editor.session.setValue(serialized.code);
  document.getElementById('dataStructures').value = serialized.type;
  document.getElementById('demoName').value = serialized.name;
  updateBreakpoints();
  updateAddedAnimations();
  let animationTab = document.getElementById('animationTab');
  animationTab.click();
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
      let pContent = animation.animationName + ' - Line: ' + item;
      newP.innerHTML = pContent;

      let newButton = document.createElement('button')
      newButton.setAttribute('class','animationButton');
      newButton.onclick = function(){
        removeAnimation(item,i)
      }
      newButton.innerHTML = '&#10006;';

      let positionDiv = document.createElement('div')
      positionDiv.setAttribute('class','positionDiv')

      let upButton = document.createElement('button')
      upButton.onclick = function(){
        moveCreatedAnimation(true,item,i)
      }
      upButton.setAttribute('class','positionButton')
      upButton.innerHTML = '&#9650'

      let downButton = document.createElement('button')
      downButton.onclick = function(){
        moveCreatedAnimation(false,item,i)
      }
      downButton.setAttribute('class','positionButton')
      downButton.innerHTML = '&#9660'

      if(i == 0){
        upButton.disabled = true;
      }
      if (i == lineAnimations.length-1) {
        downButton.disabled = true;
      }

      positionDiv.appendChild(upButton)
      positionDiv.appendChild(downButton)

      newDiv.appendChild(newP);
      newDiv.appendChild(newButton);
      newDiv.appendChild(positionDiv);

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
    params = ListAnimator.availableAnimations[selectedAnimation].params;
  }
  else if (selectedAnimator == 'plot') {
    params = PlottingAnimator.availableAnimations[selectedAnimation].params;
  }
  else if(selectedAnimator == 'graph'){
    params = GraphAnimator.availableAnimations[selectedAnimation].params;
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
  let selectedAnimator = document.getElementById('dataStructures').value;
  let paramCount;

  if (selectedAnimator == 'list'){
    paramCount = Object.keys(ListAnimator.availableAnimations[selectedAnimation].params).length;
  }
  else if (selectedAnimator == 'plot') {
    paramCount = Object.keys(PlottingAnimator.availableAnimations[selectedAnimation].params).length;
  }
  else if (selectedAnimator == 'graph') {
    paramCount = Object.keys(GraphAnimator.availableAnimations[selectedAnimation].params).length;
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
  clearConsole();
  let consoleArea = document.getElementById('consoleTab')
  consoleArea.click()

  let selectedAnimator = document.getElementById('dataStructures').value;
  let elem = document.getElementById('draw-shapes');
  elem.innerHTML = '';

  if(selectedAnimator == 'list' || selectedAnimator == 'graph'){
    let elem = document.getElementById('draw-shapes');
    two = new Two({ width: elem.offsetWidth, height: elem.offsetHeight }).appendTo(elem);
  }

  try {
    let code = addAnimationsToCode();
    myInterpreter = new Interpreter(code,initFunc);
    animationList = [];
    myInterpreter.run();
  } catch (e) {
    writeToConsole(e);
    throw e;
  }

  currentAnimationIndex=1;

  if(animationList[0][0] == 'type'){
    switch (animationList[0][1]) {
      case 'list': animator = new ListAnimator(); break;
      case 'plot':  animator = new PlottingAnimator(); break;
      case 'graph':  animator = new GraphAnimator(); break;
    }
  }
  else{
    writeToConsole("first animation must specify data structure");
    return;
  }

  updateLoaded(true);
}

function nextStep() {
  if (myInterpreter.step()) {
    window.setTimeout(nextStep, 0);
  }
}

async function step(index){

  let currentAnimation = animationList[index];

  try {
    switch (currentAnimation[0]) {
      case 'set items':  await animator.setItems(currentAnimation[1],currentAnimation[2]); break;
      case 'swap':  await animator.swap(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'highlight': await animator.highlight(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'remove highlight': await animator.removeHighlight(currentAnimation[1],currentAnimation[2]); break;
      case 'append': await animator.append(currentAnimation[1],currentAnimation[2]); break;
      case 'insert': await animator.insert(currentAnimation[1],currentAnimation[2],currentAnimation[3]);break;
      case 'remove': await animator.remove(currentAnimation[1],currentAnimation[2]);break;
      case 'replace': await animator.replace(currentAnimation[1],currentAnimation[2],currentAnimation[3]);break;
      case 'caption': await animator.caption(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'marker': await animator.addMarker(currentAnimation[1],currentAnimation[2]); break;
      case 'remove marker': await animator.removeMarker(currentAnimation[1],currentAnimation[2]); break;
      case 'plot function': await animator.plotFunction(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'plot points': await animator.plotPoints(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'clear plot': await animator.clearPlot(currentAnimation[1]); break;
      case 'evaluate': await animator.evaluateFunction(currentAnimation[1],currentAnimation[2],currentAnimation[3],currentAnimation[4]);break;
      case 'plot two point line': await animator.twoPointLine(currentAnimation[1],currentAnimation[2],currentAnimation[3],currentAnimation[4]);break;
      case 'set graph': await animator.setGraph(currentAnimation[1],currentAnimation[2],currentAnimation[3]);break;
      case 'highlight node': await animator.highlightNode(currentAnimation[1],currentAnimation[2],currentAnimation[3]);break
      case 'highlight edge': await animator.highlightEdge(currentAnimation[1],currentAnimation[2],currentAnimation[3]); break;
      case 'remove edge highlight': await animator.removeHighlightEdge(currentAnimation[1],currentAnimation[2]);break
      case 'remove node highlight': await animator.removeHighlightNode(currentAnimation[1],currentAnimation[2]);break
      case 'transition': await animator.transition(currentAnimation[1],currentAnimation[2],currentAnimation[3],currentAnimation[4]);break
      default: writeToConsole(currentAnimation[0] + ' is not an animation')
    }
  } catch (e) {
    writeToConsole(e + ' on animation: ' + currentAnimation[0] + ' (parameters may be wrong)');
    running = false;
    isAnimating = false;
    updateRunning();
    updateIsAnimating();
    currentAnimationIndex=0;
    throw e;
  }

  if(index == animationList.length-1){
    running = false;
    updateRunning();
    currentAnimationIndex=0;
  }
  isAnimating = false;
}

async function execute(){
  let consoleArea = document.getElementById('consoleTab')
  consoleArea.click()

  if(!running){
    return;
  }
  for(currentAnimationIndex; currentAnimationIndex < animationList.length; currentAnimationIndex++){
    if(running){
      await step(currentAnimationIndex);
    }
    else {
      return;
    }
  }
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
    writeToConsole(text);
    return console.log(text);
  };
  interpreter.setProperty(consoleWrapper, 'log',interpreter.createNativeFunction(logWrapper));

  //createAnimation()
  var animationWrapper = function(){
    createAnimation(arguments)
  };
  interpreter.setProperty(globalObject,'createAnimation',interpreter.createNativeFunction(animationWrapper));

}
