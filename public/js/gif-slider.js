function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

const trianglePointingRight = `<svg width="10" height="10" viewBox="0 0 10 10" style="margin-top: 3px;"><path d="M 0 0 L 10 5 L 0 10 z" fill="#888"></path></svg>`
const trianglePointingLeft = `<svg width="10" height="10" viewBox="0 0 10 10" style="margin-top: 3px; margin-left: -1px;"><path d="M 10 0 L 0 5 L 10 10 z" fill="#888"></path></svg>`

function appendInputButtons() {
  // get all doms with class="gif-slider"
  var figs = document.getElementsByClassName("gif-slider")

  for (var i = 0; i < figs.length; i++) {
    var fig = figs[i]
    var div = document.createElement("div")

    // installing input
    var input = document.createElement("input")
    // oninput fires during dragging; onchange only fires on mouseup (= when letting go of the slider)
    var one = "oninput"
    var two = "changePng(this.parentNode.parentNode.parentNode, false, this.value);"
    input.setAttribute(one, two)
    one = "type"; two = "range";
    input.setAttribute(one, two)
    one = "min"; two = "0";
    input.setAttribute(one, two)
    one = "max"; two = "9";
    input.setAttribute(one, two)
    one = "value"; two = "0";
    input.setAttribute(one, two)
    one = "class"; two = "slider";
    input.setAttribute(one, two)

    // installing buttons
    var button1 = document.createElement("button")
    button1.innerHTML = trianglePointingLeft;
    button1.setAttribute("onclick", 
      "changePng(this.parentNode.parentNode.parentNode, false)")
    button1.classList += "stepper button-left"
    var button2 = document.createElement("button")
    button2.innerHTML = trianglePointingRight;
    button2.setAttribute("onclick", 
      "changePng(this.parentNode.parentNode.parentNode, true)")
    button2.classList += "stepper button-right"

    div.setAttribute("class", "controls")

    var div1 = document.createElement("div")
    div1.appendChild(button1)
    var div2 = document.createElement("div")
    div2.setAttribute("class", "slidecontainer")
    div2.appendChild(input)
    var div3 = document.createElement("div")
    div3.appendChild(button2)

    div.appendChild(div1)
    div.appendChild(div2)
    div.appendChild(div3)

    fig.appendChild(div)
  }

  // Preloading images for faster access
  for (var i = 0; i < figs.length; i++) {
    var fig = figs[i]
    var src = fig.childNodes[1].childNodes[0].src
    for (var j = 0; j < 10; j++){
      var ix = src.indexOf(".png")
      // console.log(src.slice(0, ix - 1))
      var str = src.slice(0, ix - 1) + j + ".png"
      // console.log(str)
      preloadImages([str])
    }
  }
}

function changePng(parent, next, val = null) {
  var img = parent.children[0].childNodes[0]
  var div = parent.children[1]
  var input = div.children[1].children[0]
  var src = img.src
  var ix = src.indexOf(".png")
  var slide_no = parseInt(src.slice(ix - 1, ix))

  // check if anything else pressed? 
  slide_no = slideChange(slide_no, next, val)
  slide_no = slide_no.toString()
  input.value = slide_no
  src = src.slice(0, ix - 1) + slide_no + ".png"
  img.src = src
}

function slideChange(slide_no, next, val=null) {
  // This is for a perticular gif
  if (next == true) {
    slide_no = slide_no + 1
    if (slide_no == 10) {
      slide_no = 0
    }
  }
  else {
    slide_no = slide_no - 1
    if (slide_no == -1) {
      slide_no = 9
    }
  }

  if (val == null) {
    return slide_no
  }
  else {
    return val
  }
}
