const isDevMode = false;
const isDevServer = false;

var peer = new Peer();
var socket = undefined;

var localMediaStream = undefined;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const listener = audioCtx.listener;


function main() {

    //checkForMediaAccess(() => {
    //    console.log("bing bing");
    //});

    peer.on("connection", onPeerConnected);
    peer.on("error", onPeerError);
    peer.on("call", onPeerCall);

    peer.on("open", function (id) {
        console.log(`PeerJS opened. id is ${id}`);

        socket = io.connect(getBackendAddress(), {
            path: "/webgl-site",
            query: `peerId=${id}`
        });

        joinRoom("main-room");

        socket.on("room-players-joined", onRoomPlayersJoined);
        socket.on("room-player-left", onRoomPlayerLeft);
    });
}

function getBackendAddress() {
    if (isDevServer) {
        return "localhost:5000";
    }
    else {
        return "https://experiments.mwimmersive.com/";
    }
}




//
//  MEDIA ACCESS
//

function checkForMediaAccess(onComplete) {

    verbosePrint("Checking for media access...");

    if (localMediaStream) {
        verbosePrint("Already has media access!");
        onComplete();
        return;
    }


    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (stream) {
        verbosePrint("Obtained media access.");
        onRecievedUserMediaStream(stream);
        onComplete();
        return;

    }).catch(function (err) {
        console.log(err);
        alert(err);
    });
}


// called when requestMediaAccess grabs the media correctly
function onRecievedUserMediaStream(stream) {
    verbosePrint("Recieved user media stream...");

    setLocalVideoContent(stream);
    localMediaStream = stream;
}




//
//  LOGIC
//

function joinRoom(roomName) {
    socket.emit("join-room", "mainRoom");
}

function callUsers(userDatas) {

    if (localMediaStream) {
        userDatas.forEach(userData => {
            callUser(userData);
        });
    }
    else {
        checkForMediaAccess(() => {
            userDatas.forEach(userData => {
                callUser(userData);
            });
        });
    }



}

function callUser(user) {
    console.log(`Calling user with peerId ${user.peerId}...`);
    var call = peer.call(user.peerId, localMediaStream);
}







//
//  PEER CALLBACKS
//

// called when this peer has an error (almost always fatal :( )
function onPeerError(err) {
    console.log(err);
    alert(err.type);
}

// called when another peer connects to us
function onPeerConnected(conn) {
    console.log(`Connected to peer ${conn.peer}`);
}


function onPeerCall(call) {


    if (localMediaStream) {
        answerPeerCall(call);
    }
    else {
        checkForMediaAccess(() => {
            answerPeerCall(call);
        })
    }


}

function answerPeerCall(call) {
    console.log(`Answering call from ${call.peer}...`);
    call.answer(localMediaStream);

    call.on("stream", function (stream) {

        console.log(`Opened call from ${call.peer}.`);
        setRemoteVideoContent(call.peer, stream);
    })
}






//
//  WebSocket Callbacks
//

function onRoomPlayersJoined(userDatas) {
    verbosePrint(`onRoomPlayersJoined called with ${userDatas}`);

    addUsersToUserList(userDatas);
    callUsers(userDatas);
}

function onRoomPlayerLeft(userData) {
    verbosePrint(`onRoomPlayerLeft called with ${userData}`);

    removeUserFromUserList(userData.socketId);
}




//
//  HTML Methods
//

// Sets the video content for the local video frame
function setLocalVideoContent(stream) {

    const videoBar = document.getElementById("video-bar");

    var localUser = {
        socketId: "localSocket",
        peerId: "localPeer"
    };

    // If there's no existing window
    const existingWindow = document.getElementById(localUser.socketId)
    if (!existingWindow) {
        // Add one!
        const videoWindow = createUserItemContainer(localUser);
        videoBar.appendChild(videoWindow);
    }




    const localVideo = document.getElementById(localUser.peerId);

    if (localVideo) {
        localVideo.muted = true;
        localVideo.srcObject = stream;
    }
}

// Sets the video content for the remote video frame
function setRemoteVideoContent(peerId, stream) {
    const remoteVideo = document.getElementById(peerId);

    if (remoteVideo) {
        remoteVideo.srcObject = stream;
    }
}

// Adds new users to the user UI
function addUsersToUserList(users) {
    const videoBar = document.getElementById("video-bar");

    // For each new user...
    users.forEach(user => {
        // Get user if they already have an element
        const alreadyExistingUser = document.getElementById(user.socketId);

        // If the user doesn't exist...
        if (!alreadyExistingUser) {

            // Add them!
            const videoWindow = createUserItemContainer(user);
            videoBar.appendChild(videoWindow);
        }
    });
}

// Removes a user from the user UI
function removeUserFromUserList(socketId) {
    const videoWindow = document.getElementById(socketId);

    if (videoWindow) {
        videoWindow.remove();
    }
}

// Construct a container for active users
function createUserItemContainer(user) {
    const videoWindow = document.createElement("div");
    const videoPlayer = document.createElement("video");


    videoWindow.setAttribute("class", "video-window");
    videoWindow.setAttribute("id", user.socketId);
    videoWindow.appendChild(videoPlayer);

    videoPlayer.setAttribute("class", "video-player");
    videoPlayer.setAttribute("id", user.peerId);
    videoPlayer.autoplay = true;


    return videoWindow;
}





//
//  AUDIO METHODS
//

function setLocalPlayerPosition(x, y, z) {
    listener.posX = x;
    listener.posY = y;
    listener.posZ = z;

    console.log(`Set local player pos to x:${x} y:${y}, z:${z}`);
}









//
//  DEVELOPER METHODS
//

function verbosePrint(text) {
    if (isDevMode) {
        console.log(text);
    }
}






// Run Script
main();