import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { VideoContext } from './components/VideoPlayer';

const SocketContext = createContext();

// const socket = io('https://192.168.1.12:5000/');
const socket = io('https://docpatientapp.onrender.com');
// const socket = io('https://nodeserver-video.onrender.com/');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState([]);
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [mecheck, setmecheck] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const { value } = useContext(VideoContext);
  // let [track]="";
  let tracks;
  var isZ1 = false;
  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setStream(currentStream);
  //       document.querySelector('video').srcObject = currentStream;
  //       // myVideo.current.srcObject = currentStream;
  //     });
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        console.log("UseEffect Camera Check New" + me);
        document.querySelector('video').srcObject = currentStream;
        const [track] = currentStream.getVideoTracks();
        tracks = track;
        var isZ = false;
        console.log("WOrk  con");
        const capabilities = track.getCapabilities();
        const settings = track.getSettings();
        // Check whether zoom is supported or not.
        if (!('zoom' in settings)) {
          isZ = false;
          // document.getElementById("show").innerHTML = " ME= " + me;
          console.log("WOrk IF con" + me);
          // document.getElementById("show").innerHTML = "Zoom= " + isZ + " ME= " + me;
        } else {
          isZ = true;
          let min = capabilities.zoom.min;
          let max = capabilities.zoom.max;
          let step = capabilities.zoom.step;
          console.log("min:-" + min + "max:-" + max + "step:-" + step);
          // document.getElementById("show1").innerHTML = " ME= " + me;
        }
        isZ1 = isZ;
      });

    // const a= "ayush";
    // socket.on('me',(userid)=>{
    //   setMe(userid);
    // });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
      console.log("SetCall Work")
    });


  }, []);

// ===================Zooom DATA send And Received=========
    // socket.emit('send_message', {mecheck:mecheck,Value:value});
    // console.log("send_message Value:-", value + " "+ mecheck)

    socket.on('connect',()=>{
      console.log("I Connected to the socket... hoorey")
    })

    socket.on('rec_message', ({caller_id,Val}) => {
      setmecheck(caller_id);
      console.log("data Received:-" + Val);
      if (isZ1) {
        tracks.applyConstraints({ advanced: [{ zoom: Val }] });
        console.log("Me:-" + me)
      }
    })
// ===================End Zooom DATA send And Received=========



// * ========================Start Socket Data = ME AND From Both============================================
    // =================Socket ID=================
    socket.emit('socketId', me);
      console.log("socketId call send:-", me);

    // socket.on('socketId', data => {
    //   console.log("socketId data:-" + data);
      // setIdentity(data);
    // });

    // ==========Received Data :- emit/on Both=========
    socket.emit('Rec_socketId', {Rec_id:call.from, Value:value});
    console.log("Rec_socketId call Received:-", call.from);

    // ========server to client value catch =============
    // socket.on('socket_client', fromdata => {
    //   console.log("socket_client data:-" + fromdata);
    //   setmecheck(fromdata);
    // });
    console.log("socket_client mecheck data 1:-" + mecheck);
    console.log("socket_client me data 1:-" + me);


// ========================ENd Socket Data = ME AND From Both============================================



  const answerCall = () => {
    console.log("ANSWER_CALL=" + callAccepted)
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
      console.log("signal= " + data, "calluser id to=" + call.from)
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;

    })
    peer.signal(call.signal);

    connectionRef.current = peer;
    console.log("ANSWER_CALL=" + callAccepted)
  };


  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      console.log("userToCall= " + id, "signalData= " + data, "from= " + me, "name=" + name)

    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
      console.log("work calluser 1")
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      console.log("work calluser Accepted")
      peer.signal(signal);
    });

    connectionRef.current = peer;
    console.log("connectionRef.current" + connectionRef.current)
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };


  // let MediaRecord;
  // const StartRecording = () => {
  //   console.log("START VIDEO......?")
  //   MediaRecord = new MediaRecorder(stream, { MimeType: 'video/mp4' });
  //   MediaRecord.start();
  //   setRecording(MediaRecord);

  //   // var options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};
  //   // try {
  //   //   const mediaRecorder = new MediaRecorder(stream, options);
  //   //   setRecording(mediaRecorder);
  //   // } catch (e0) {
  //   //   console.log('Unable to create MediaRecorder with options Object: ', options, e0);
  //   //   try {
  //   //     options = {mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000};
  //   //     const mediaRecorder = new MediaRecorder(stream, options);
  //   //   } catch (e1) {
  //   //     console.log('Unable to create MediaRecorder with options Object: ', options, e1);
  //   //     try {
  //   //     const mediaRecorder = new MediaRecorder(stream);
  //   //     } catch (e2) {
  //   //       alert('MediaRecorder is not supported by this browser.');
  //   //       console.log('Unable to create MediaRecorder', e2);
  //   //       return;
  //   //     }
  //   //   }
  //   // }
  //   console.log("Start Recording:-" + Recording);
  // }

  // const StopRecording = () => {
  //   console.log("STOP VIDEO...?")
  //   // clearInterval(setRecording(0))
  //   Recording.stop();
  //   // Recording.controls = true;
  //   // console.log("recoding Stopped,data available");
  //   console.log("Recording Stop:-" + Recording);
  // }
  // const DownloadVideo = () => {

  //   console.log("DOWNLOAD VIDEO...?")
  //   // let blob = new Blob(["Hello, world!"], {type: 'text/plain'});
  //   // console.log("blob check:-"+blob)

  //   // a.href = URL.createObjectURL(blob);
  //   // var blob = new Blob([Recording], { type: 'video/webm' });
  //   // var url = window.URL.createObjectURL(blob);
  //   // var a = document.createElement('a');
  //   // a.style.display = 'none';
  //   // a.href = url;
  //   // document.body.appendChild(a);
  //   // a.click();
  //   // setTimeout(function () {
  //   //   document.body.removeChild(a);
  //   //   window.URL.revokeObjectURL(url);
  //   // }, 100);

  //   var blob = new Blob([Recording], {
  //     'type': 'video/mp4'
  //     // 'type': 'text/plain'
  //   });
  //   console.log("BLOB:-" + blob)
  //   var url = URL.createObjectURL(blob);
  //   console.log("URL:-" + url)
  //   var a = document.createElement('a');
  //   console.log("A:-" + a)
  //   document.body.appendChild(a);
  //   a.href = url;
  //   a.download = 'test.mp4';
  //   a.click();
  // }




  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      // Identity,
      // StartRecording,
      // StopRecording,
      // DownloadVideo
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
























// import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
// import { io } from 'socket.io-client';
// import Peer from 'simple-peer';
// import { VideoContext } from './components/VideoPlayer';

// const SocketContext = createContext();



// const socket = io('https://192.168.1.14:5000/');
// // const socket = io('https://docpatientapp.onrender.com');
// // const socket = io('https://nodeserver-video.onrender.com/');

// const ContextProvider = ({ children }) => {
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callEnded, setCallEnded] = useState(false);
//   const [stream, setStream] = useState([]);
//   const [name, setName] = useState('');
//   const [call, setCall] = useState({});
//   const [me, setMe] = useState('');
//   const [mecheck, setmecheck] = useState('');

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();

//   const { value } = useContext(VideoContext);
//   // let [track]="";
//   let tracks;
//   var isZ1 = false;
//   // useEffect(() => {
//   //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//   //     .then((currentStream) => {
//   //       setStream(currentStream);
//   //       document.querySelector('video').srcObject = currentStream;
//   //       // myVideo.current.srcObject = currentStream;
//   //     });
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then((currentStream) => {
//         setStream(currentStream);
//         console.log("UseEffect Camera Check New" + me);
//         document.querySelector('video').srcObject = currentStream;
//         const [track] = currentStream.getVideoTracks();
//         tracks = track;
//         var isZ = false;
//         console.log("WOrk  con");
//         const capabilities = track.getCapabilities();
//         const settings = track.getSettings();
//         // Check whether zoom is supported or not.
//         if (!('zoom' in settings)) {
//           isZ = false;
//           // document.getElementById("show").innerHTML = " ME= " + me;
//           console.log("WOrk IF con" + me);
//           // document.getElementById("show").innerHTML = "Zoom= " + isZ + " ME= " + me;
//         } else {
//           isZ = true;
//           let min = capabilities.zoom.min;
//           let max = capabilities.zoom.max;
//           let step = capabilities.zoom.step;
//           console.log("min:-" + min + "max:-" + max + "step:-" + step);
//           // document.getElementById("show1").innerHTML = " ME= " + me;
//         }
//         isZ1 = isZ;
//       });

//     // const a= "ayush";
//     // socket.on('me',(userid)=>{
//     //   setMe(userid);
//     // });

//     socket.on('me', (id) => setMe(id));

//     socket.on('callUser', ({ from, name: callerName, signal }) => {
//       setCall({ isReceivingCall: true, from, name: callerName, signal });
//       console.log("SetCall Work")
//     });


//   }, []);

// // ===================Zooom DATA send And Received=========
//     socket.emit('send_message', {mecheck:mecheck,Value:value});
//     console.log("send_message Value:-", value + " "+ mecheck)

//     socket.on('rec_message', data => {
//       // setMecheck(data);
//       console.log("data Received:-" + data);
//       if (isZ1) {
//         tracks.applyConstraints({ advanced: [{ zoom: data }] });
//         console.log("Me:-" + me)
//       }
//     })
// // ===================End Zooom DATA send And Received=========



// // * ========================Start Socket Data = ME AND From Both============================================
//     // =================Socket ID=================
//     socket.emit('socketId', me);
//       console.log("socketId call send:-", me);

//     // socket.on('socketId', data => {
//     //   console.log("socketId data:-" + data);
//       // setIdentity(data);
//     // });

//     // ==========Received Data :- emit/on Both=========
//     socket.emit('Rec_socketId', call.from);
//     console.log("Rec_socketId call Received:-", call.from);

//     // ========server to client value catch =============
//     socket.on('socket_client', fromdata => {
//       console.log("socket_client data:-" + fromdata);
//       setmecheck(fromdata);
//     });
//     console.log("socket_client mecheck data 1:-" + mecheck);
//     console.log("socket_client me data 1:-" + me);


// // ========================ENd Socket Data = ME AND From Both============================================



//   const answerCall = () => {
//     console.log("ANSWER_CALL=" + callAccepted)
//     setCallAccepted(true);

//     const peer = new Peer({ initiator: false, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('answerCall', { signal: data, to: call.from });
//       console.log("signal= " + data, "calluser id to=" + call.from)
//     });

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;

//     })
//     peer.signal(call.signal);

//     connectionRef.current = peer;
//     console.log("ANSWER_CALL=" + callAccepted)
//   };


//   const callUser = (id) => {
//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on('signal', (data) => {
//       socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
//       console.log("userToCall= " + id, "signalData= " + data, "from= " + me, "name=" + name)

//     });

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream;
//       console.log("work calluser 1")
//     });

//     socket.on('callAccepted', (signal) => {
//       setCallAccepted(true);
//       console.log("work calluser Accepted")
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//     console.log("connectionRef.current" + connectionRef.current)
//   };

//   const leaveCall = () => {
//     setCallEnded(true);

//     connectionRef.current.destroy();

//     window.location.reload();
//   };


//   // let MediaRecord;
//   // const StartRecording = () => {
//   //   console.log("START VIDEO......?")
//   //   MediaRecord = new MediaRecorder(stream, { MimeType: 'video/mp4' });
//   //   MediaRecord.start();
//   //   setRecording(MediaRecord);

//   //   // var options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};
//   //   // try {
//   //   //   const mediaRecorder = new MediaRecorder(stream, options);
//   //   //   setRecording(mediaRecorder);
//   //   // } catch (e0) {
//   //   //   console.log('Unable to create MediaRecorder with options Object: ', options, e0);
//   //   //   try {
//   //   //     options = {mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000};
//   //   //     const mediaRecorder = new MediaRecorder(stream, options);
//   //   //   } catch (e1) {
//   //   //     console.log('Unable to create MediaRecorder with options Object: ', options, e1);
//   //   //     try {
//   //   //     const mediaRecorder = new MediaRecorder(stream);
//   //   //     } catch (e2) {
//   //   //       alert('MediaRecorder is not supported by this browser.');
//   //   //       console.log('Unable to create MediaRecorder', e2);
//   //   //       return;
//   //   //     }
//   //   //   }
//   //   // }
//   //   console.log("Start Recording:-" + Recording);
//   // }

//   // const StopRecording = () => {
//   //   console.log("STOP VIDEO...?")
//   //   // clearInterval(setRecording(0))
//   //   Recording.stop();
//   //   // Recording.controls = true;
//   //   // console.log("recoding Stopped,data available");
//   //   console.log("Recording Stop:-" + Recording);
//   // }
//   // const DownloadVideo = () => {

//   //   console.log("DOWNLOAD VIDEO...?")
//   //   // let blob = new Blob(["Hello, world!"], {type: 'text/plain'});
//   //   // console.log("blob check:-"+blob)

//   //   // a.href = URL.createObjectURL(blob);
//   //   // var blob = new Blob([Recording], { type: 'video/webm' });
//   //   // var url = window.URL.createObjectURL(blob);
//   //   // var a = document.createElement('a');
//   //   // a.style.display = 'none';
//   //   // a.href = url;
//   //   // document.body.appendChild(a);
//   //   // a.click();
//   //   // setTimeout(function () {
//   //   //   document.body.removeChild(a);
//   //   //   window.URL.revokeObjectURL(url);
//   //   // }, 100);

//   //   var blob = new Blob([Recording], {
//   //     'type': 'video/mp4'
//   //     // 'type': 'text/plain'
//   //   });
//   //   console.log("BLOB:-" + blob)
//   //   var url = URL.createObjectURL(blob);
//   //   console.log("URL:-" + url)
//   //   var a = document.createElement('a');
//   //   console.log("A:-" + a)
//   //   document.body.appendChild(a);
//   //   a.href = url;
//   //   a.download = 'test.mp4';
//   //   a.click();
//   // }




//   return (
//     <SocketContext.Provider value={{
//       call,
//       callAccepted,
//       myVideo,
//       userVideo,
//       stream,
//       name,
//       setName,
//       callEnded,
//       me,
//       callUser,
//       leaveCall,
//       answerCall,
//       // Identity,
//       // StartRecording,
//       // StopRecording,
//       // DownloadVideo
//     }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { ContextProvider, SocketContext };
