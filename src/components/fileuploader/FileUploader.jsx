import React, { useEffect } from 'react'
import MusicFileIcon from '../../assets/MusicFileIcon';

const FileUploader = ({ audioTracks, setAudioTracks, uploadAudio }) => {
    const handleUploadAudio = (e) => {

        const audio = e.target.files[0];

        // let previousTracks = localStorage.getItem('tracks')

        // if (previousTracks) {
        //     let newTracks = [...JSON.parse(previousTracks), audio]
        //     localStorage.setItem("tracks", newTracks)
        // }
        // else {

        //     localStorage.setItem('tracks', [JSON.stringify(audio)])
        // }

        setAudioTracks([...audioTracks, audio])


    }


    return (
        <div style={{width:'100%'}}>
            <label htmlFor='up' className='lb'>
                <MusicFileIcon />
            

                Click here to Upload Audio
             

            </label>
            <input style={{ display: 'none' }} accept='audio/*' type='file' id='up' onChange={uploadAudio} />

        </div>
    )
}

export default FileUploader