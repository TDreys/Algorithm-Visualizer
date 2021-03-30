//bubblesort

createAnimation('type','list')
var items = [4,3,2,1];
createAnimation('set items',items);
var swapped = true;
var swaps = 0;
var comparisons = 0;

while(swapped){
  swapped = false;
  for(var i = 0; i < items.length - 1; i++){
    createAnimation('highlight',[i,i+1],'LightYellow');
    createAnimation('caption','comparisons',comparisons+=1);
    if(items[i] > items[i+1]){
      createAnimation('caption','swaps',swaps +=1);
      createAnimation('highlight',[i,i+1],'LightPink');
      var temp = items[i];
      items[i] = items[i+1];
      items[i+1] = temp;
      createAnimation('swap',i,i+1);
      swapped = true;
    }
    else{
      createAnimation('highlight',[i,i+1],'LightGreen');
    }
    createAnimation('remove highlight',[i,i+1]);
  }
}


//insertion sort

list.setItems([4,3,2,1])

for(var i = 0; i < list.length(); i++){
  var j = i
  while(j > 0 && list.get(j-1)>list.get(j)){
    list.swap(j,j-1);
    j -= 1;
  }
}


//selection sort

list.setItems([4,3,2,1])

for(var i = 0; i < list.length(); i++){
  var min = i;

  for(var j = i; j < list.length(); j++){
    if (list.get(j) < list.get(min)){
      min = j;
    }
  }

  if (!(min == i)){
    list.swap(min,i);
  }
}


//list append
for(var i = 0; i < 5; i++){
   list.append(i)
}

//set items example
var items = [4,3,2,1];
var temp = items[1];
items[1] = items[2];
items[2] = temp;

'{"code":"var items = [4,3,2,1];\\\nvar swapped = true;\\\nvar swaps = 0;\\\nvar comparisons = 0;\\\n\\\nwhile(swapped){\\\n  swapped = false;\\\n  for(var i = 0; i < items.length - 1; i++){\\\n    if(items[i] > items[i+1]){\\\n      var temp = items[i];\\\n      items[i] = items[i+1];\\\n      items[i+1] = temp;\\\n      swapped = true;\\\n    }\\\n    else{\\\n    }\\\n  }\\\n}\\\n\\\n","animations":{"1":[{"animationName":"set items","hasElse":false,"params":["items"]}],"8":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightYellow\'"]},{"animationName":"caption","hasElse":false,"params":["\'Comparisons\'","comparisons+=1"]}],"10":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightPink\'"]},{"animationName":"swap","hasElse":false,"params":["i","i+1"]},{"animationName":"caption","hasElse":false,"params":["\'Swaps\'","swaps+=1"]}],"15":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightGreen\'"]}],"16":[{"animationName":"remove highlight","hasElse":false,"params":["[i,i+1]"]}]},"type":"list","name":"test"}'

"{\"code\":\"var items = [4,3,2,1];\r\nvar swapped = true;\r\nvar swaps = 0;\r\nvar comparisons = 0;\r\n\r\nwhile(swapped){\r\n  swapped = false;\r\n  for(var i = 0; i < items.length - 1; i++){\r\n    if(items[i] > items[i+1]){\r\n      var temp = items[i];\r\n      items[i] = items[i+1];\r\n      items[i+1] = temp;\r\n      swapped = true;\r\n    }\r\n    else{\r\n    }\r\n  }\r\n}\r\n\r\n\",\"animations\":{\"1\":[{\"animationName\":\"set items\",\"hasElse\":false,\"params\":[\"items\"]}],\"8\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightYellow'\"]},{\"animationName\":\"caption\",\"hasElse\":false,\"params\":[\"'Comparisons'\",\"comparisons+=1\"]}],\"10\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightPink'\"]},{\"animationName\":\"swap\",\"hasElse\":false,\"params\":[\"i\",\"i+1\"]},{\"animationName\":\"caption\",\"hasElse\":false,\"params\":[\"'Swaps'\",\"swaps+=1\"]}],\"15\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightGreen'\"]}],\"16\":[{\"animationName\":\"remove highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\"]}]},\"type\":\"list\",\"name\":\"test\"}"
