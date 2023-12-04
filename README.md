# CS2340-EC-OIT
2023 CS2340 Extra Credit OIT assignment
Matthew Virginia and Harrison Stein

DUE DECEMBER 4TH!

Creating a raspberry-pi (Raspberry Pi Zero 2 W) based Twitchbot that has the same functions as a mod:

Twitch Developer Account: Necessary for client ID and secret which will allow bot to interact with the Twitch API
Bot will be programmed in Javascript as a script
	- Will handle Twitch chat messages and moderate them 
	- The Twitch API will be used to interact with the chat
Will also connect into Twitch’s IRC chat (Internet Relay Chat)
	- Once connected, the bot will receive all messages and scan for matches
	- If pattern is matched, that person will be automatically banned from the server 
		- Can also be used to timeout a user or post a message to the chat when a specific word/phrase is used
		- Timeouts will apply to a three strike rule:
			- 1st offense: 10 minute ban
			- 2nd offense: 24 hour ban
			- 3rd offense: Permanent ban
Aside From Just Bans:
Welcome Messages: Greet viewers with a custom welcome message when they join the stream
Ex. Hi _(username)____ and welcome to ___(streamer)___ stream!
Commands: Custom chat commands that viewers can use
Ex. Show the schedule of streams, social media links/usernames, and FAQ’s
Integrating APIs: Allow the bot the connect with external APIs to fetch data
Ex. Twitch API (chat interaction and creation of bot)

API's have keys and access tokens which come from the creator of the script for the bot to utilize

Separation of Tasks:
Matthew
Work on the script (excluding connectivity with Raspberry Pi and APIs)
Harrison 
Work on connectivity with Raspberry Pi and external APIs
Collaborate with Matthew to help with script if needed (might be needed for APIs and testing on the Raspberry Pi)

to run as a local host:
in local you do "node server.js" and in Local(2) you do "node twitchBOT.js"
