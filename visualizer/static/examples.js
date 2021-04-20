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

var items = [5,6,7,4,3,2,4,5]
createAnimation('set items',items)

for(var i = 0; i < items.length; i++){
    createAnimation('highlight',range(0,i),'lightblue')
    var min = i;

    for(var j = i; j < items.length; j++){
        createAnimation('highlight',j,'lightyellow',1000)
        if (items[j] < items[min]){
            createAnimation('remove highlight',min,0)
            min = j;
            createAnimation('highlight',min,'lightgreen',1000)
        }
        else if(min != j){
            createAnimation('highlight',j,'lightpink',1000)
            createAnimation('remove highlight',j)
        }
        else{
            createAnimation('highlight',min,'lightgreen',1000)
        }
    }

    if (!(min == i)){
        var temp = items[min];
        items[min] = items[i];
        items[i] = temp;
        createAnimation('swap',min,i)
    }
}

createAnimation('remove highlight',range(0,items.length))

function range(start, end) {
    var list = [];
    for (var i = start; i < end; i++) {
        list.push(i);
    }
    return list;
}

console.log(items)


//list append
for(var i = 0; i < 5; i++){
   list.append(i)
}

//set items example
var items = [4,3,2,1];
var temp = items[1];
items[1] = items[2];
items[2] = temp;

//breadth first
var node0 = [1,2,3];
var node1 = [4,7];
var node2 = [3,4];
var node3 = [1];
var node4 = [0,5,7];
var node5 = [8,7];
var node6 = [1];
var node7 = [];
var node8 = [2];

var graph = [node0,node1,node2,node3,node4,node5,node6,node7,node8];
graph = redirect(graph);
graph = sortNodeIndexes(graph);

createAnimation('set graph',graph,false)

var startNode = 6;
var discovered = [startNode]
var queue = [startNode]

while(queue.length != 0){
    var current = queue.shift();
    for(var i = 0; i < graph[current].length;i++){
        if(discovered.indexOf(graph[current][i]) < 0){
            discovered.push(graph[current][i])
            queue.push(graph[current][i])
        }
    }
    createAnimation('highlight node',discovered,'crimson',0)
    createAnimation('highlight node',queue,'lightpink')
}


//change edge directions so they go both ways
function redirect(graph){
    for(var i = 0; i < graph.length;i++){
        for(var j = 0; j < graph[i].length;j++){

            graph[graph[i][j]].push(i)
        }
    }
    return graph;
}

//sort the list of adjecent nodes
function sortNodeIndexes(graph){
    for(var i = 0; i < graph.length;i++){
        graph[i] = graph[i].sort();
    }
    return graph
}


createAnimation('set graph',[[1,2,[3,4]],[],[],[]],'array')
createAnimation('transition',0,[1,2,3],'green')
createAnimation('highlight node',[1,2,3],'blue')
createAnimation('highlight edge',[[0,2],[0,1]],'red')
createAnimation('remove node highlight',[1,2,3])
createAnimation('remove edge highlight',[[0,2],[0,1]])

createAnimation('set graph',[[[1,7],2,3],[0],[0],[0],[2,3,5],[4,1]],'array',true,1000)
createAnimation('highlight edge',[[0,1],[1,0],[4,2],[1,5]],'chartreuse',100)

'{"code":"var items = [4,3,2,1];\\\nvar swapped = true;\\\nvar swaps = 0;\\\nvar comparisons = 0;\\\n\\\nwhile(swapped){\\\n  swapped = false;\\\n  for(var i = 0; i < items.length - 1; i++){\\\n    if(items[i] > items[i+1]){\\\n      var temp = items[i];\\\n      items[i] = items[i+1];\\\n      items[i+1] = temp;\\\n      swapped = true;\\\n    }\\\n    else{\\\n    }\\\n  }\\\n}\\\n\\\n","animations":{"1":[{"animationName":"set items","hasElse":false,"params":["items"]}],"8":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightYellow\'"]},{"animationName":"caption","hasElse":false,"params":["\'Comparisons\'","comparisons+=1"]}],"10":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightPink\'"]},{"animationName":"swap","hasElse":false,"params":["i","i+1"]},{"animationName":"caption","hasElse":false,"params":["\'Swaps\'","swaps+=1"]}],"15":[{"animationName":"highlight","hasElse":false,"params":["[i,i+1]","\'LightGreen\'"]}],"16":[{"animationName":"remove highlight","hasElse":false,"params":["[i,i+1]"]}]},"type":"list","name":"test"}'

"{\"code\":\"var items = [4,3,2,1];\r\nvar swapped = true;\r\nvar swaps = 0;\r\nvar comparisons = 0;\r\n\r\nwhile(swapped){\r\n  swapped = false;\r\n  for(var i = 0; i < items.length - 1; i++){\r\n    if(items[i] > items[i+1]){\r\n      var temp = items[i];\r\n      items[i] = items[i+1];\r\n      items[i+1] = temp;\r\n      swapped = true;\r\n    }\r\n    else{\r\n    }\r\n  }\r\n}\r\n\r\n\",\"animations\":{\"1\":[{\"animationName\":\"set items\",\"hasElse\":false,\"params\":[\"items\"]}],\"8\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightYellow'\"]},{\"animationName\":\"caption\",\"hasElse\":false,\"params\":[\"'Comparisons'\",\"comparisons+=1\"]}],\"10\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightPink'\"]},{\"animationName\":\"swap\",\"hasElse\":false,\"params\":[\"i\",\"i+1\"]},{\"animationName\":\"caption\",\"hasElse\":false,\"params\":[\"'Swaps'\",\"swaps+=1\"]}],\"15\":[{\"animationName\":\"highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\",\"'LightGreen'\"]}],\"16\":[{\"animationName\":\"remove highlight\",\"hasElse\":false,\"params\":[\"[i,i+1]\"]}]},\"type\":\"list\",\"name\":\"test\"}"
