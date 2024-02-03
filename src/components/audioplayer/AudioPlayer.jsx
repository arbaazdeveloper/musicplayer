import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import PlayIcon from '../../assets/PlayIcon';
import NextIcon from '../../assets/NextIcon';
import PrevIcon from '../../assets/PrevIcon';
import PauseIcon from '../../assets/PauseIcon';
const AudioPlayer = ({ tracks, playerRef, playTrack, playNextTrack, setIsPlaying, playPrevTrack }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const handleTimelineChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    playerRef.current.currentTime = newTime;
  };
  const handleTimeUpdate = () => {
    setCurrentTime(playerRef.current.currentTime)
  }
  const rangeRef = useRef();

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  const playOrPause = () => {
    if (playerRef.current.paused) {
      playerRef.current.play()
    } else {
      playerRef.current.pause()
    }

  }
  const formatNan=(duration)=>{
    if(duration.includes('NaN')){
      return  "0:00"
    }else{
      return duration
    }

  }
  return (
    <div className='player-container'>
      <audio
        ref={playerRef}

        className="audio-player"
        onPause={(e) => {

          localStorage.setItem('playbackTime', e.target.currentTime);
          setIsPlaying(false)

        }}
        onPlay={() => {
          setIsPlaying(true)

        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNextTrack}
        onLoadedMetadata={(e) => {
          let lastTrack = JSON.parse(localStorage.getItem('lastTrack'));
          if (lastTrack) {
            let savedTime = lastTrack.playBackTime
            e.target.currentTime = savedTime ? savedTime : 0;
          }


        }}

      />
      <div className='player-controls'>
        <div className='player-actions'>
           <div className='prev' onClick={playPrevTrack}>

          <PrevIcon />
           </div>
          <div className='play-pause' onClick={playOrPause}>
            {playerRef?.current?.paused?<PlayIcon />:<PauseIcon/>}
          </div>

          <div className='next' onClick={playNextTrack}>

          <NextIcon />
          </div>



        </div>
        <div className='player-detail'>
          <span>{formatTime(currentTime)}</span>

          <input type='range' min='0'
            onChange={handleTimelineChange}
            value={currentTime}
            ref={rangeRef}
            style={{
              backgroundImage: `linear-gradient(to right, #3950fb ,${playerRef.current ? (currentTime / playerRef.current.duration) * 100 : 0}%, transparent ${playerRef.current ? (currentTime / playerRef.current.duration) * 100 : 0}%)`,

            }}
            max={playerRef.current ? playerRef.current.duration : 0} percent={playerRef.current ? (currentTime / playerRef.current.duration) * 100 : 0}

          />
          <span>{formatNan(formatTime(playerRef.current ? playerRef.current.duration : 0))}</span>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer