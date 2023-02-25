import React, { createContext, useContext } from 'react';
import { Grid, Typography, Paper, makeStyles,Slider,Radio,FormControl, RadioGroup, FormControlLabel} from '@material-ui/core';
import { ContextProvider, SocketContext } from '../Context';
// import { TransformWrapper,TransformComponent } from 'react-zoom-pan-pinch';

const VideoContext= createContext({});
// const Doctor=true;

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },

}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, StartRecord, StopRecord,DownloadVideo } = useContext(SocketContext);
  const classes = useStyles();

  const [ value, setValue] = React.useState(1)
  const [ Selected, setSelected] = React.useState("")
  
  const changeHandler = (event, data)=>{
    setValue(data)
    console.log("changehandler="+data);
   }

   const selectionChangeHandler = (event) => {
    setSelected(event.target.value);
  };

  //  console.log("value:-"+value);
  //  console.log("Selected:-"+Selected);

  return (<div>
     <FormControl>
      <RadioGroup row value={Selected} onChange={selectionChangeHandler} >
        <FormControlLabel  value="DOCTOR" control={<Radio />} label="DOCTOR" />
        <FormControlLabel  value="PATIENT" control={<Radio />} label="PATIENT" />
      </RadioGroup>
    </FormControl>
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
             <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <video muted ref={myVideo} autoPlay className={classes.video} />
          </Grid> 
          {/* {Selected='DOCTOR'? */}
          {/* <Slider
          value={value}
          onChange={changeHandler}
          defaultValue={1}
          valueLabelDisplay="auto"
          min={1}
          max={800}/> */}
          {/* :console.log(" else work")}    */}
      </Paper>
      )}
      
   
    {/* <div id='show' style={{color:"white"}}>Error</div> */}
    {/* <button className='Start_recording' style={{width:"80px",height:"50px"}} onClick={StartRecord} >Start Recording</button>
    <button className='stop-recording' style={{width:"80px",height:"50px"}} onClick={StopRecord}>Stop Recording</button>
    <button className='Downloade' style={{width:"80px",height:"50px"}} onClick={DownloadVideo}>Downloade Recording</button> */}
      {/* <div id='show1' style={{color:"white"}}>Error1</div> */}

      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterrBottom>{call.name || 'Name'}</Typography>
            {/* <TransformWrapper defaultScale={1} defaultPositionX={100} defaultPositionY={200}> */}
              {/* <TransformComponent> */}
                <video ref={userVideo} autoPlay className={classes.video} />
              {/* </TransformComponent> */}
            {/* </TransformWrapper> */}
            
          </Grid>
          <Slider
          value={value}
          onChange={changeHandler}
          defaultValue={1}
          valueLabelDisplay="auto"
          min={1}
          max={800}/>
        </Paper>
      )}
    </Grid>
    <VideoContext.Provider value={{value}}>
      {/* {console.log(" vdocon value:-"+value)} */}
        <ContextProvider/>
    </VideoContext.Provider>
    </div>
  );
};

export {VideoPlayer,VideoContext};
