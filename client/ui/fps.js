function updateFPS(frameDocument, fps) {
    // Try catch because draw() will sometimes call before document has loaded  
    // console.log("FPS: " + fps);
    try {
        
        let fpsElement = frameDocument.getElementById("fps");
        fpsElement.innerHTML = 'FPS: ' + fps;

        if (fps < 20){
            if (fpsElement.classList.contains("text-lime-600")) {
                fpsElement.classList.remove("text-lime-600");
            }
            fpsElement.classList.add("text-red-600");
            // frameDocument.classList.add("outline-red-400 outline-2 outline-offset-1");
        } else if (fps <= 35){
            if (fps.classList.contains("text-lime-600")) {
                // frameDocument.classList.remove("outline-red-500 outline-2 outline-offset-1");
                fpsElement.classList.remove("text-lime-600");
                fpsElement.classList.add("text-yellow-600");
            }
            if (fpsElement.classList.contains("text-red-600")) {
                fpsElement.classList.remove("text-red-600");
                fpsElement.classList.add("text-yellow-600");
            }
        } else {
            // console.log("FPS: " + fps);
            if (fpsElement.classList.contains("text-red-600")) {
                fpsElement.classList.remove("text-red-600");
            }
            if (fpsElement.classList.contains("text-yellow-600")) {
                fpsElement.classList.remove("text-yellow-600");
            }
            fpsElement.classList.add("text-lime-600");
        }
    } catch { }
}