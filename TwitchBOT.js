const tmi = require('tmi.js');

// Define configuration options
const opts = {
    identity: {
        username: 'virginiavlrt',
        password: 'oauth:6nsetq4a056l8orr8jqgo47ge10zey'
    },
    channels: [
        'virginiavlrt'
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect().catch(e => {
    console.error('Connection error:', e);
});



let pollOptions = {};
let pollVotes = {};
let pollActive = false;

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim().split(' ');

    // Check if it's a command and which command it is
    switch (commandName[0]) {
        case '!dice':
            const num = rollDice();
            client.say(target, `You rolled a ${num}`);
            console.log(`* Executed ${commandName[0]} command`);
            break;
        case '!poll':
            if (commandName.length !== 3) {
                client.say(target, `Usage: !poll option1 option2`);
                return;
            }
            startPoll(target, commandName[1], commandName[2]);
            break;
        case '!vote':
            if (!pollActive || commandName.length !== 2) {
                return;
            }
            recordVote(context.username, commandName[1]);
            break;
        default:
            console.log(`* Unknown command ${commandName[0]}`);
    }
}

// Function to start a poll
function startPoll(channel, option1, option2) {
    pollOptions = { option1, option2 };
    pollVotes = { [option1]: 0, [option2]: 0 };
    pollActive = true;
    client.say(channel, `Poll started! Type !vote ${option1} or !vote ${option2} to vote. Poll ends in 60 seconds.`);

    setTimeout(() => {
        endPoll(channel);
    }, 60000);
}

// Function to record a vote
function recordVote(username, option) {
    if (option !== pollOptions.option1 && option !== pollOptions.option2) {
        return;
    }
    pollVotes[option]++;
}

// Function to end the poll and announce the winner
function endPoll(channel) {
    pollActive = false;
    const winner = pollVotes[pollOptions.option1] > pollVotes[pollOptions.option2] ? pollOptions.option1 : pollOptions.option2;
    const votes = pollVotes[winner];
    client.say(channel, `${winner} has won with ${votes} votes!`);
}

// Function called when the "dice" command is issued
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}


//!FAQ (im 20, from minnesota, go to SMU, CS major!)
//!Socials (link to linkedin bc professional)
//!timeout <user> <time>
//