import {useState,useRef, useEffect} from 'react'
import { HMSToSeconds, secondsToHMS, alternativeHasClip, getClipsFromWords } from './helpers'

const Video = ({video}) => {
    
    const [rawWordsResult,setRawWordsResult] = useState(null)
    const timeRef = useRef(null)
    const [clips,setClips] = useState(null)

    useEffect(()=>{

        const clipResults = getClipsFromWords(video.words)
        const clipsToSet = {}

        clipResults.forEach(result => {
            const key = secondsToHMS(result.start - 12);
            
            clipsToSet[key] = result
        })

        setClips(clipsToSet)

    },[video])

    //console.log(video.words[30]);

    const getWordsByTime = (time,padding = 2) => {
        const timeSeconds = HMSToSeconds(time);
        
        const results = [];

        video.words.map(word => {


            word.alternatives.forEach(alt => {
                alt.result?.forEach(res => {
                    if(res.start >= (timeSeconds - padding) && res.start <= (timeSeconds + padding))
                    {
                        results.push(alt);
                        return;
                    }
                })
            })

            return results
        })

        console.log(results);
    }

    return <div>
        <h1><a href={`https://www.twitch.tv/videos/${video.id}`} target="_blanket">
                {video.id}
              </a></h1>
        <fieldset>
            <legend>Inspect Parsed Words</legend>
            <input type="text" placeholder="mm:ss" ref={timeRef} /><button onClick={()=>{
                getWordsByTime(timeRef.current.value)
            }}>Search By Time</button>
            {rawWordsResult && <ul>
            </ul>}
        </fieldset>
        <fieldset>
            <legend>Clips</legend>
            {clips && <ul>
                {Object.keys(clips).map(timeStamp => {
                    return <li key={timeStamp}>
                        <a href={`https://www.twitch.tv/videos/${video.id}?t=${timeStamp}`} target="_blank">{timeStamp}</a>
                        </li>
                })}
            </ul>}
        </fieldset>
    </div>
}

export default Video;