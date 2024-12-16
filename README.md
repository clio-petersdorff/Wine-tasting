# Competitive Wine-Tasting App 🍷

A multiplayer app for hosting competitive wine-tasting events. Participants join a tasting room, score wines, and compare results in real-time.

## Features
- Host and join tasting rooms
- Real-time scoring and updates with Pusher
- Minimalist, user-friendly interface

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Pusher

## How to Play:
1. Prepare for the Tasting: Everyone should bring a bottle of wine to the party. The host will cover each bottle (e.g., by putting it in a paper bag) and write a number on it. This makes it a blind tasting, where participants won't know which wine they’re tasting.
2. Create the Tasting Room: The host creates a tasting room in the app, which generates a QR code. Participants can join the tasting room by scanning the QR code.
3. Join the Game: Participants enter their names and choose an avatar before entering the virtual waiting room. Once everyone is ready, the host can start the tasting by letting everyone into the virtual tasting room (at this point, you should start pouring the first wine).
4. Start the Tasting: Wines are presented one at a time. Participants score each wine on a scale from 1 to 10 and can take notes about the wine’s taste, aroma, and appearance. After each wine, participants return to the waiting room while the host opens the next bottle.
5. End the Game: Once all wines have been tasted and scored, the host ends the game. The app automatically calculates the scores and displays the results, revealing which wine received the highest ratings. The winner is the participant who brought the best wine to the party.
