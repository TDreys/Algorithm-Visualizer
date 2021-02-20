var myInterpreter;
var blocked = false;
var animationList = [];

function load(code){
  myInterpreter = new Interpreter(code,initFunc);
  nextStep();
}

function execute(code){
  for(var i = 0; i < animationList.length; i++){
    switch (animationList[i][0]) {
      case 'switch':  break;
      case 'createList':  break;
      case 'highlight':  break;
    }
  }
}

function nextStep() {
  if (myInterpreter.step()) {
    window.setTimeout(nextStep, 0);
  }
}

function step(){
  console.log(myInterpreter.step());
}

function animate(frames, animationCallback){
  for(var frameCount = 0; frameCount < frames; frameCount++){
    animationCallback(frameCount);
    console.log("frame");
    two.update();
  }
}

function createAnimation(animation,params){
  animationList.push(['switch',params]);
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

  //list class
  var realList = new List();

  var listWrapper = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, 'list', listWrapper);

  var setItemsWrapper = function(items) {
    return realList.setItems(items);
  };
  interpreter.setProperty(listWrapper, 'setItems',interpreter.createNativeFunction(setItemsWrapper));

  var drawWrapper = function() {
    return realList.draw()
  };
  interpreter.setProperty(listWrapper, 'draw',interpreter.createNativeFunction(drawWrapper));

  var swapWrapper = function(i,j) {
    return realList.swap(i,j)
  };
  interpreter.setProperty(listWrapper, 'swap',interpreter.createNativeFunction(swapWrapper));

  var lengthWrapper = function(i,j) {
    return realList.length();
  };
  interpreter.setProperty(listWrapper, 'length',interpreter.createNativeFunction(lengthWrapper));

  var getWrapper = function(i) {
    return realList.get(i);
  };
  interpreter.setProperty(listWrapper, 'get',interpreter.createNativeFunction(getWrapper));

  var highlightWrapper = function(i) {
    return realList.highlight(i);
  };
  interpreter.setProperty(listWrapper, 'highlight',interpreter.createNativeFunction(highlightWrapper));

  var removeHighlightsWrapper = function() {
    return realList.removeHighlights();
  };
  interpreter.setProperty(listWrapper, 'removeHighlights',interpreter.createNativeFunction(removeHighlightsWrapper));

  var appendWrapper = function(item) {
    return realList.append(item);
  };
  interpreter.setProperty(listWrapper, 'append',interpreter.createNativeFunction(appendWrapper));
}
