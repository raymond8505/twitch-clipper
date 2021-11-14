# What?

First and foremost, a **Work in Progress**.

Downloads your public Twitch videos, parses them for voice commands to create clips, or mark videos for deletion. So you can easily create highlights in your videos in real time while you play using voice commands in real time.

# Who?

Me mostly, or you if you stream from a console and want an easy way to clip your recordings in real time using voice commands.

# Install

1. install this package
1. download and install twitch-dl
1. download and install ffmpeg if needed
1. Create your .env file by copying `.env-sample` and renaming to `.env`
1. [register your twich app](https://dev.twitch.tv/console/apps/create) and add the necessary info to your `.env`
1. Download your prefered model from the Vosk site, unpack contents to `/model/`, if `/model/rnnlm` exists, rename or delete.

# Instructions

## Voice Commands

- `clip` - once detected, client will list a clip 12s before it detects when you said the command
- `delete` - once detected, client will list a clip 2s before hand for confirmation. Delete manually in twitch (for now) and click delete in client. Video will remain in db, but be marked deleted

## App

1. In separate terminals run the following package scripts `server:json` and `client` and `server:app`
1. when client opens in a new browser tab click `get new videos` to download all public videos

## Non NPM Dependencies

- [FFMPEG](https://ffmpeg.org/download.html)
  -- Either have the executable in your OS Path, or drop it in the root of the project dir. I'm calling it directly with exec (for now)
- [twitch-dl](https://github.com/ihabunek/twitch-dl) -- follow the instructions to install, **rename to twitch-dl**
- [Vosk]() -- Vosk is an offline AI for analizing audio, see [here](https://alphacephei.com/vosk/models) for different models and languages support. If a model contains a directory `rnnlm` remove or rename it if the model isn't generating output
