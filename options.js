document.getElementsByTagName('input')[0].addEventListener("input", function() {
    var min = this.min;
    var max = this.max;
    var val = this.value;
    console.log(val);
    this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

    if (this.value == 0) {
        this.setAttribute("class", "zero-input");
    } else {
        this.setAttribute("class", "");
    }

}, false);
