function changeInputContent(){

  if(document.getElementById("algorithms").value == 'Bubble Sort'){
    document.getElementById('code').value =
`list.setItems([4,3,2,1])

var swapped = true;

while(swapped){
  swapped = false;
  for(var i = 0; i < list.length() - 1; i++){
    if(list.get(i) > list.get(i+1)){
      list.swap(i,i+1);
      swapped = true;
    }
  }
}`
  }

  else if(document.getElementById("algorithms").value == 'Insertion Sort'){
    document.getElementById('code').value =
`list.setItems([4,3,2,1])

for(var i = 0; i < list.length(); i++){
  var j = i
  while(j > 0 && list.get(j-1)>list.get(j)){
    list.swap(j,j-1);
    j -= 1;
  }
}`
  }

  else if(document.getElementById("algorithms").value == 'Selection Sort'){
    document.getElementById('code').value =
`list.setItems([4,3,2,1])

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
}`
  }

  else if(document.getElementById("algorithms").value == 'Append'){
    document.getElementById('code').value =
`for(var i = 0; i < 5; i++){
   list.append(i)
}`
  }
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
