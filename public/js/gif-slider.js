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

function appendInputButtons() {
  // get all doms with class="gif-slider"
  var figs = document.getElementsByClassName("gif-slider")

  for (var i = 0; i < figs.length; i++) {
    var fig = figs[i]
    var div = document.createElement("div")

    // installing input
    var input = document.createElement("input")
    var one = "onchange"
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
    button1.appendChild(document.createTextNode("<"))
    button1.setAttribute("onclick", 
      "changePng(this.parentNode.parentNode.parentNode, false)")
    var button2 = document.createElement("button")
    button2.appendChild(document.createTextNode(">"))
    button2.setAttribute("onclick", 
      "changePng(this.parentNode.parentNode.parentNode, true)")
    button2.setAttribute("padding-top", "5px")

    div.setAttribute("align", "center")

    var div1 = document.createElement("div")
    div1.appendChild(button1)
    div1.setAttribute("float", "left")
    var div2 = document.createElement("div")
    div2.setAttribute("class", "slidecontainer")
    div2.setAttribute("float", "left")
    div2.appendChild(input)
    var div3 = document.createElement("div")
    div3.setAttribute("float", "right")
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
