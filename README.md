# What?

First and foremost, a **Work in Progress**.

Downloads your public videos, parses them for voice commands to create clips.

# Who?

Me mostly, or you if you stream from a console and want an easy way to clip your recordings in real time using voice commands.

# Install

1. install this package
2. download and install twitch-dl
3. download and install ffmpeg if needed
4. [register your twich app](https://dev.twitch.tv/console/apps/create)
5. Download your prefered model from the Vosk site, unpack contents to `/model/`, if `/model/rnnlm` exists, rename or delete.
6. Create your .env file by copying `.env-sample` and renaming to `.env` and fill in your client Id, secret and Twitch username

# Instructions

## Tools

1. `node twitch-clipper` To download and prep any public videos from your channel
2. `node vr-test <video's twitch id> To parse` To parse the given video

## App

1. In separate terminals run `server:json` and `client`
1. run `node twitch-clipper` to get all your public videos
1. run `node vr-test` on each video's id once downloaded (I'll automate this soon)
1. refresh the client in your browser to access any found clips, or use the `Parsed Words Inspector` to inspect the raw results surrounding a particular time. Use this tool to better understand how your model hears your voice to dial in your `command synonymns` - words the model often mishears instead of the command you spoke. EI You say "clip", the model outputs "click"
1. click clip timestamps to open the Twitch player at that spot in a new tab

## Non NPM Dependencies

- [FFMPEG](https://ffmpeg.org/download.html)
  -- Either have the executable in your OS Path, or drop it in the root of the project dir. I'm calling it directly with exec (for now)
- [twitch-dl](https://github.com/ihabunek/twitch-dl) -- follow the instructions to install, **rename to twitch-dl**
- [Vosk]() -- Vosk is an offline AI for analizing audio, see [here](https://alphacephei.com/vosk/models) for different models and languages support. If a model contains a directory `rnnlm` remove or rename it if the model isn't generating output
