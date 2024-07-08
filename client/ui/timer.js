function updateTimer(frameDocument, timer) {
    // Try catch because draw() will sometimes call before document has loaded  
    try {
        let mins = Math.floor(timer / 60);
        let secs = timer % 60;
        let timerelement = frameDocument.getElementById("timer");
        let timersecs = secs.toString();
        let timermins = mins.toString();
        if (secs < 10) {
            timersecs = "0" + secs.toString();
            // // console.log("less than 10")
        }
        if (mins < 10) {
            timermins = "0" + mins.toString();
        }
        timerelement.innerHTML = timermins + ":" + timersecs;

        if (timer < 60){
            timerelement.classList.add("text-red-600");
            // frameDocument.classList.add("outline-red-400 outline-2 outline-offset-1");
        } else {
            if (timerelement.classList.contains("text-red-600")) {
                // frameDocument.classList.remove("outline-red-500 outline-2 outline-offset-1");
                timerelement.classList.remove("text-red-600");
            }
        }


        if (timer < 0) {
            timer.innerHTML = "00:00";
        }
        
    } catch { }
}

function updateRoomCode(frameDocument, roomCode, isGameStarted) {
    // Try catch because draw() will sometimes call before document has loaded
    try {
        let roomCodeElement = frameDocument.getElementById("roomcode");
        roomCodeElement.innerHTML = "Room Code: " + roomCode;
        if (isGameStarted) {
            roomCodeElement.innerHTML = "Game Started";
        }
    } catch { }
}