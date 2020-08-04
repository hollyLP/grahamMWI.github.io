


const videoPlayer = document.getElementById("video-player");
const tickDelay = 16;
var time = 0;
var time2 = 0;
var sinX = 0;
var sinY = 0;
var sinZ = 0;
var speed = 500;

setInterval(function() {
	sinX = (Math.sin(time / speed) + 1) * 40;
	videoPlayer.style.left = `${sinX}%`;

	sinY = (Math.sin(time / speed / 3) + 1) * 40;
	videoPlayer.style.top = `${sinY}%`;

	sinZ = (Math.sin(time / speed / 5) + 1) * 40;
	videoPlayer.style.scale = `${50 + sinZ}%`;

	moveAudioSource(sinX, sinY, sinZ);

	time += tickDelay;
}, tickDelay);







const startButton = document.getElementById("start-button");
startButton.addEventListener("click", function() {
	
	videoPlayer.muted = !videoPlayer.muted;




})








const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const listener = audioCtx.listener;

const posX = window.innerWidth / 2;
const posY = window.innerHeight / 2;
const posZ = 300;

listener.posX = posX;
listener.posY = posY;
listener.posZ = posZ - 5;


if(listener.forwardX)
{
	listener.forwardX.value = 0;
	listener.forwardY.value = 0;
	listener.forwardZ.value = -1;
	listener.upX.value = 0;
	listener.upY.value = 1;
	listener.upZ.value = 0;
}
else
{
	listener.setOrientation(0, 0, -1, 0, 1, 0);
}




const pannerModel = "HRTF";

const innerCone = 60;
const outerCone = 90;
const outerGain = 0.3;


const distanceModel = 'linear';
const maxDistance = 10000;
const refDistance = 1;

const rollOff = 10;




const positionX = 0;
const positionY = 0;
const positionZ = 0;

const orientationX = 0.0;
const orientationY = 0.0;
const orientationZ = -1.0;









const panner = new PannerNode(audioCtx, {
    panningModel: pannerModel,
    distanceModel: distanceModel,
    positionX: positionX,
    positionY: positionY,
    positionZ: positionZ,
    orientationX: orientationX,
    orientationY: orientationY,
    orientationZ: orientationZ,
    refDistance: refDistance,
    maxDistance: maxDistance,
    rolloffFactor: rollOff,
    coneInnerAngle: innerCone,
    coneOuterAngle: outerCone,
    coneOuterGain: outerGain
})



function moveAudioSource(posX, posY, posZ) {
	panner.positionX.value = posX - 40;
	panner.positionY.value = posY - 40;
	panner.positionZ.value = posZ - 40;
}


const audioElement = videoPlayer;
const track = audioCtx.createMediaElementSource(audioElement);
track.connect(panner).connect(audioCtx.destination);