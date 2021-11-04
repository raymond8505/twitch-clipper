# What?

Downloads your public videos, parses them for voice commands to create create clips.

# Who?

Me mostly, or you if you stream from a console and want an easy way to clip your recordings in real time using voice commands.

# Install

1. install this package
2. download and install twitch-dl
3. download and install ffmpeg if needed
4. [register your twich app](https://dev.twitch.tv/console/apps/create)
5. Create your .env file by copying `.env-sample` and renaming to `.env` and fill in your client Id, secret and Twitch username
6. run `node twitch-clipper.js`

## Non NPM Dependencies

- [FFMPEG](https://ffmpeg.org/download.html)
  -- Download the binary for your OS and put it in the twitch-clipper dir
- [twitch-dl](https://github.com/ihabunek/twitch-dl) -- follow the instructions to install, **rename to twitch-dl**
