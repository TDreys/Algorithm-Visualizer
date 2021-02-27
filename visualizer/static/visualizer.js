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

  let callbacks = []

  for (let i = 1; i < animationList.length; i++){

    let currentAnimation;

    switch (animationList[i][0]) {
      case 'setItems':  currentAnimation = function() {animator.setItems(animationList[i][1])}; break;
      case 'swap':  currentAnimation = function() {animator.swap(animationList[i][1],animationList[i][2])}; break;
      case 'highlight': currentAnimation = function() {animator.highlight(animationList[i][1])}; break;
      case 'append': currentAnimation = function() {animator.append(animationList[i][1])}; break;
    }

    console.log("awaiting" + i)
    await currentAnimation();
    console.log("awaited" + i)

  }
}

function createAnimation(animation){
  for(let i = 0;i < animation.length; i++){
    if(typeof animation[i] == 'object'){
      animation[i] = Object.values(Object.values(animation[i])[2])
    }
  }

  animationList.push(animation);
  console.log(animationList);
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
