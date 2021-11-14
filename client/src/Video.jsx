import {useState,useRef, useEffect} from 'react'
import { HMSToSeconds, secondsToHMS, getClipsFromWords, getDeletesFromWords } from './helpers'
import {css} from '@emotion/css'

const Video = ({video}) => {
    
    const timeRef = useRef(null)
    const [clips,setClips] = useState(null)
    const [deletes,setDeletes] = useState(null)
    const [foundResults,setFoundResults] = useState([])

    useEffect(()=>{

        const clipResults = getClipsFromWords(video.words)
        const clipsToSet = {}

        clipResults.forEach(result => {
            const key = secondsToHMS(result.start - 12);
            
            clipsToSet[key] = result
        })

        setClips(clipsToSet)

        const deleteResults = getDeletesFromWords(video.words)
        const deletesToSet = {}

        deleteResults.forEach(result => {
            const key = secondsToHMS(result.start - 2)
            deletesToSet[key] = result;
        })

        setDeletes(deletesToSet)

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

        setFoundResults(results);
    }

    return <article className={css`
    flex-grow: 1`}>
        <header className={css`
            display: flex;
            justify-content: space-between;
        `}>
            <h1><a href={`https://www.twitch.tv/videos/${video.id}`} target="_blanket">
                {video.id}
            </a></h1>
            <button onClick={()=>{
                fetch(`//localhost:3002/delete/${video.id}`).then(()=>window.location.reload())
            }}>Delete</button>
        </header>
        <fieldset>
            <legend>Inspect Parsed Words</legend>
            <input type="text" placeholder="mm:ss" ref={timeRef} /><button onClick={()=>{
                getWordsByTime(timeRef.current.value)
            }}>Search By Time</button>
            {foundResults.length && <ul>
                {
                    foundResults.map((res,i) => {
                        return <li>
                            <span css={css`
                                margin-right: 1em;
                            `}>{secondsToHMS(res.result[0].start)}</span>
                            <strong>"{res.text.trim()}"</strong>
                            </li>
                    })
                }
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
        {deletes && Object.keys(deletes).length > 0 && <fieldset>
            <label>Deletes</label>
            {deletes && <ul>
                {Object.keys(deletes).map(timeStamp => {
                    return <li key={timeStamp}>
                        <a href={`https://www.twitch.tv/videos/${video.id}?t=${timeStamp}`} target="_blank">{timeStamp}</a>
                        </li>
                })}
            </ul>}
            </fieldset>}
    </article>
}

export default Video;