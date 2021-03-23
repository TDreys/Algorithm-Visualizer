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
