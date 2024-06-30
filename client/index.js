// Function to naviagte to script.html when the user joins a new meeting room
function enterRoom(meetingCode) {
    // Input the username as a url query and navigate to chat.html
    let usernameInputBox = document.getElementById("ignInput");

    // Make sure the username isnt empty
    if (usernameInputBox.value.length == 0) {
        Swal.fire({
            title: "Error entering game!",
            text: "Username is empty, please enter a username.",
            icon: "error"
          });
    }
    else {
        console.log("Navigating to sketch.html");
        window.location.href = "sketch.html?ign=" + usernameInputBox.value + "&roomCode=" + meetingCode;
    }
}

// Function to ensure the user does not input an invalid meeting room code
function validateCode() {
    // console.log("Validating code");
    // Check that the input box isnt empty
    let roomCodeInputBox = document.getElementById("roomCodeInput");
    // console.log(roomCodeInputBox.value)
    if (roomCodeInputBox.value.length != 5) {
        Swal.fire({
            title: "Error entering game!",
            text: "Meeting room code must be 5 characters long.",
            icon: "error"
          });
    }
    else {
        enterRoom(roomCodeInputBox.value);
    }
}


function openIFrame() {
  document.getElementById('iframe-container').classList.remove('hidden');
}

function closeIframe() {
    document.getElementById('iframe-container').classList.add('hidden');
    }

window.addEventListener('message', function(event) {
  if (event.data === 'close-iframe') {
    console.log('closing iframe ')
    document.getElementById('iframe-container').classList.add('hidden');
  }
  
});
