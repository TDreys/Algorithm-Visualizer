var myInterpreter;
var animationList = [];

function load(code){
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

function caption(name,value){
  let captionDiv = document.getElementById('captions')
  let currentCaptions = captionDiv.children
  let newCaption = document.createElement("P");
  newCaption.innerText = name + ": " + value;

  for(let i = 0; i <= currentCaptions.length-1; i++){
    let currentText = currentCaptions[i].innerText;
    if(currentText.startsWith(name)){
       captionDiv.replaceChild(newCaption, captionDiv.childNodes[i]);
       return;
    }
  }
  captionDiv.appendChild(newCaption);
}

async function execute(code){

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
      case 'caption': await caption(animationList[i][1],animationList[i][2]); break;
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
