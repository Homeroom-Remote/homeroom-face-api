function maxValuesWithThreshold(o, n, threshold) {
  // Get object values and sort descending
  const values = Object.values(o).sort((a, b) => b - a);

  // Find nth maximum value
  const maxN = values[n - 1];

  // Filter object to return only key/value pairs where value >= maxN
  return Object.entries(o).reduce(
    (o, [k, v]) => (v >= maxN && v > threshold ? { ...o, [k]: v } : o),
    {}
  );
}

var video = document.querySelector("#vid");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log("Something went wrong!");
    });
}

video.addEventListener("loadedmetadata", (e) => {
  var width = e.target.videoWidth,
    height = e.target.videoHeight;
  (async () => {
    faceapi.nets.ssdMobilenetv1
      .loadFromUri("/models")
      .then(faceapi.nets.faceLandmark68Net.loadFromUri("/models"))
      .then(faceapi.nets.faceExpressionNet.loadFromUri("/models"))
      .then(async () => {
        setInterval(() => {
          (async () => {
            const detection = await faceapi
              .detectAllFaces(video)
              .withFaceExpressions();

            const detectionObj = detection[0].expressions;

            console.log(maxValuesWithThreshold(detectionObj, 3, 0.1));
          })();
        }, 1000);
      })
      .catch((e) => {
        console.warn(e);
      });
  })();
});
