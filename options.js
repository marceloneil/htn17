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

window.onload = function(){
    changeImage("http://res.cloudinary.com/dwtlq1bra/image/upload/v1505593963/ufylekqzscvxbno0vls0.png");
}
function changeImage(url){
    document.getElementById('imageView').src= url;
}