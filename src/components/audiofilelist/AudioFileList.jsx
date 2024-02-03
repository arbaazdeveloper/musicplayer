import React from 'react'
import './file.css'
const AudioFileList = ({ audioTracks, playTrack, currentTrack }) => {
  return (
    <div className='list'>

      {
        audioTracks.map((track, index) => {
          return <div key={`${index}`} className={`audio-file ${currentTrack === track.name && 'active'}`} onClick={() => { playTrack(track) }}>
            <span>{track.name}</span>
            {
              currentTrack === track.name && <>
                <div className='dance-container'>

                  <div className='dance'></div>
                  <div className='dance'></div>
                  <div className='dance'></div>
                </div>
              </>
            }

          </div>
        })
      }
     { 
     audioTracks.length===0 && <>
     
     <div className='blank'>
       <h1>Upload Audio files to play</h1>
       <h5>Click Below to upload</h5>
     </div>
     </>
     }
    </div>
  )
}

export default AudioFileList