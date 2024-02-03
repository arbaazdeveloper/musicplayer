import React, { useEffect, useRef, useState } from 'react'
import FileUploader from '../components/fileuploader/FileUploader'
import AudioPlayer from '../components/audioplayer/AudioPlayer'
import AudioFileList from '../components/audiofilelist/AudioFileList';
import './style.css'

const Player = () => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState('');
    const [isPlaying, setIsPlaying] = useState(false)
    const playerRef = useRef();
    const [db, setDb] = useState(null);

    const playTrack = (track) => {

        const audio = URL.createObjectURL(track)
        playerRef.current.src = audio;
        playerRef.current.play();
        setCurrentTrack(track.name);
        localStorage.removeItem('lastTrack');
        setIsPlaying(true)


    }


    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            const lastTrackInfo = { name: currentTrack, playBackTime: playerRef.current.currentTime }
            localStorage.setItem('lastTrack', JSON.stringify(lastTrackInfo))
        })


    }, [currentTrack])


    useEffect(() => {

        const openDb = async () => {
            const dbName = 'audioDB';
            const version = 1;

            const request = window.indexedDB.open(dbName, version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore('audioFiles', { autoIncrement: true });
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                setDb(db);
            };

            request.onerror = (event) => {
                console.error('Error opening IndexedDB:', event.target.error);
            };
        };

        openDb();
    }, []);

    const saveAudioToDB = async (audioData) => {
        const transaction = db.transaction(['audioFiles'], 'readwrite');
        const store = transaction.objectStore('audioFiles');

        const request = store.add(audioData);

        request.onsuccess = () => {

        };

        request.onerror = (event) => {
            console.error('Error saving audio to IndexedDB:', event.target.error);
        };
    };
    const fetchAudioFromDb = () => {
        if (db) {
            const transaction = db.transaction(['audioFiles'], 'readonly')
            const store = transaction.objectStore('audioFiles');
            const request = store.getAll();

            request.onsuccess = (event) => {
                const files = event.target.result;
                setAudioTracks(files);

                const lastTrack = JSON.parse(localStorage.getItem('lastTrack'))
                if (lastTrack) {
                    let find = files.find((item) => item.name === lastTrack.name);

                    if (find) {
                        const audio = URL.createObjectURL(find)
                        playerRef.current.src = audio;
                        setCurrentTrack(find.name);


                    }
                }
            };

            request.onerror = (event) => {
                console.error('Error fetching audio files from IndexedDB:', event.target.error);
            };
        }
    }
    useEffect(() => {
        fetchAudioFromDb();

    }, [db])

    const uploadAudio = (e) => {
        const audio = e.target.files[0];
        saveAudioToDB(audio)
        setAudioTracks([...audioTracks, audio])

    }
    const playNextTrack = () => {

        let nextTrackIndex;
        audioTracks.some((track, i) => {
            if (track.name === currentTrack) {
                nextTrackIndex = i + 1;
                return true;
            }
        })

        if (nextTrackIndex >= 0 && nextTrackIndex <= audioTracks.length - 1) {
            playTrack(audioTracks[nextTrackIndex])

        }
    }
    const playPrevTrack = () => {

        let prevTrackIndex;
        audioTracks.some((track, i) => {
            if (track.name === currentTrack) {
                prevTrackIndex = i + -1;
                return true;
            }
        })

        if (prevTrackIndex >= 0 && prevTrackIndex <= audioTracks.length - 1) {
            playTrack(audioTracks[prevTrackIndex])

        }
    }



    return (
        <div className='main'>



            <div className='row'>
                <div className='col col-1'>
                    <img className={isPlaying ? 'animate' : ''} src='https://pngimg.com/d/vinyl_PNG1.png' />
                    <div className='now-playing-view-mobile'>
                <h4>Now Playing: </h4>
                <marquee direction="left" behavior="scroll" scrollamount="2">
                    {currentTrack}
                </marquee>
            </div>

                </div>
                <div className='col col-2'>
                    <AudioFileList playTrack={playTrack} audioTracks={audioTracks} currentTrack={currentTrack} />
                    <FileUploader uploadAudio={uploadAudio} setAudioTracks={setAudioTracks} audioTracks={audioTracks} />

                </div>
            </div>
            <AudioPlayer playNextTrack={playNextTrack} playerRef={playerRef} setIsPlaying={setIsPlaying} playPrevTrack={playPrevTrack}/>
            <div className='now-playing-view'>
                <h4>Now Playing: </h4>
                <marquee direction="left" behavior="scroll" scrollamount="2">
                    {currentTrack}
                </marquee>
            </div>
        </div>
    )
}

export default Player