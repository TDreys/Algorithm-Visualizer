var myInterpreter;
var animationList = [];

function load(code){
  myInterpreter = new Interpreter(code,initFunc);
  animationList = [];
  nextStep();
}

function nextStep() {
  if (myInterpreter.step()) {
    window.setTimeout(nextStep, 0);
  }
}

function execute(code){

  var animator;

  if(animationList[0][0] == 'type'){
    switch (animationList[0][1]) {
      case 'list': animator = new ListAnimator(); break;
      case 'tree':  break;
      case 'graph':  break;
    }
  }
  else{
    console.log("first animation must specify data structure")
    return;
  }

  // for(var i = 1; i < animationList.length; i++){
  //   switch (animationList[i][0]) {
  //     case 'setItems':  animator.setItems(animationList[i][1]); break;
  //     case 'swap':  animator.swap(animationList[i][1]); break;
  //     case 'highlight':  animator.hightlight(animationList[i][1]); break;
  //     case 'append': animator.append(animationList[i][1]); break;
  //   }
  // }

  for(var i = 1; i < animationList.length; i++){
    switch (animationList[i][0]) {
      case 'setItems':  console.log("setitems"); break;
      case 'swap':  console.log("swap"); break;
      case 'highlight':  console.log("highlight"); break;
      case 'append': console.log("append"); break;
    }
  }
}

function step(){
  console.log("implement");
}

function createAnimation(animation,params){
  animationList.push([animation,params]);
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
  var animationWrapper = function(animation,param){
    createAnimation(animation,param)
  };
  interpreter.setProperty(globalObject,'createAnimation',interpreter.createNativeFunction(animationWrapper));

}
