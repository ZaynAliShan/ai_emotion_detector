const video = document.getElementById("video");

//promise all will return ture if all are ture otherwise false
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models/tiny_face_detector_model-weights_manifest.json'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models/face_landmark_68_model-weights_manifest.json'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models/face_recognition_model-weights_manifest.json'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models/face_expression_model-weights_manifest.json')
]).then(startVideo) //show video after loading all models and it's a success scenario

function startVideo() {
  navigator.navigator.mediaDevices.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video); //making a canvas to show face detections and box
  document.body.append(canvas); //attaching canvas to body
  
  const displaySize = //object
  { 
    width: video.width,
    height: video.height
  }
  faceapi.matchDimensions(canvas, displaySize); //matching face api with our canvas and it's display size

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, //detecting all faces with landmarks and expressions, using asynchornization function for awaitng of faceapi every 100sec
    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);//drawing detections
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);//drawing lips/nose/eyes etc landmarks
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections); //draws expressions along with detections and landmarks
  }, 100)
})
