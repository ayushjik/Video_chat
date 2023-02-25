import React from 'react';
import { VideoContext } from './VideoPlayer';

const Video = () => {
    const {value, myVideo,stream,setstream} = React.useContext(VideoContext);
let [track] = "";
  let capabilities = "";
  let settings = "";
  navigator.mediaDevices.getUserMedia({ video: { zoom: true }, audio: false })
    .then(mediaStream => {
        setstream(stream)
      //   document.querySelector('.zoom').srcObject = mediaStream;
      myVideo.current.srcObject = mediaStream;

      [track] = mediaStream.getVideoTracks();
      capabilities = track.getCapabilities();
      settings = track.getSettings();

      console.log("track:-" + track + " capabilities:-" + capabilities + " settings:-" + settings);
      // document.getElementById("show2").innerHTML = settings;
      // const input = document.querySelector('.zoom1');
      // console.log("input navigation:-" + input);

      // Check whether zoom is supported or not.
      // if (!('zoom' in settings)) {
      //   return Promise.reject('Zoom is not supported by ' + track.label);
      // }


      // Map zoom to a slider element.
      // input.min = capabilities.zoom.min;
      // input.max = capabilities.zoom.max;
      // input.step = capabilities.zoom.step;
      // input.value = settings.zoom;

      // document.getElementById("show2").innerHTML = "Sh " + input.min + " " + input.max + " " + input.step
      // input.oninput = function (event) {
        track.applyConstraints({ advanced: [{ zoom : {value} }] });
        console.log("value video file:-"+value);
        // document.getElementById("show3").innerHTML = event.target.value + " Ayush";
      // }
      //   input.hidden = false;
    })
}

    export default Video
