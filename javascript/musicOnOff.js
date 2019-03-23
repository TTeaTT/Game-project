//Change music img

var tImg = ['img/volume.png','img/volumeoff.png'];
        
var vImg = true;
function changeVolImg(){
    if (vImg){
        document.getElementById('iImg').src = tImg[1];
        vImg = false;
    }
    
    else {
        document.getElementById('iImg').src = tImg[0];
        vImg = true;
    }
}
