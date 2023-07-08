let hours = document.getElementsByTagName("div")[1];
console.log(hours);
let minutes = document.getElementsByTagName("div")[2];
console.log(minutes);
let seconds = document.getElementsByTagName("div")[3];
console.log(seconds);

let colors = document.getElementById("color") //bg
console.log(colors)
let b = 149

let audio = document.getElementById("audio")
console.log(audio)
let dt = new Date();
hours.innerText = dt.getHours();
minutes.innerText = dt.getMinutes();
seconds.innerText = dt.getSeconds();
let x = 10

setInterval(() => {
  let newDate = new Date();
  console.log(newDate.getSeconds());
  hours.innerText = newDate.getHours();
  minutes.innerText = newDate.getMinutes();
  seconds.innerText = newDate.getSeconds();
  //150 60 211
}, 1000);

function getColor(){
console.log(colors.value)
let setColor = colors.value
document.body.style.background = setColor
}

let fore=document.getElementById("forecolor")
let container = document.getElementById("container")
function getForeColor(){
    console.log(fore.value)
    let setColor = fore.value
    container.style.background = setColor
}
let txt_color = document.getElementById("textcolor")
function getTextColor(){
  let setColor = txt_color.value
  document.body.style.color = setColor

}

let add_item = document.getElementById("add-item")
console.log(add_item)
function addListItem(){
  let x = prompt("Enter task details")
  console.log(x.value)
  while (x=='' || x==null) {
    alert("No task was added to the list!")
    return
    }
  
  let list = document.getElementById("list")
  let item = document.createElement("li")
  let chech_box = document.createElement("input")
  chech_box.type = "checkbox"
  let label = document.createElement("label")
  label.className = "strikethrough"
  label.innerText = x
  console.log(list)
  console.log(item)
  console.log(chech_box)
  console.log(label)
  list.appendChild(item)
  item.appendChild(chech_box)
  item.appendChild(label)
  alert("Task "+x+" added to the list")
}

function generateWater(){
let water_time = document.getElementById("water-timer")
let time = Number.parseInt(water_time.value)
console.log(time)
console.log((time/60))
let height = 0
let container = document.getElementById("h2o-container")
console.log(container)


let newDate = new Date();
let water_hours = document.getElementById("water-hours")
let water_mins = document.getElementById("water-minutes")
let water_seconds = document.getElementById("water-seconds")
let min_display = time%60
water_hours.innerText = Math.floor(time/60)
water_mins.innerText = min_display
water_seconds.innerText = 0
setInterval(() => {
  
}, 1000);

}