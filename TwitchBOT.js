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

// Define an array of profane words
const profanityArray = ['badword1', 'badword2', 'badword3'];

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Convert message to lowercase and check for profanity
    const lowerCaseMsg = msg.toLowerCase().trim();
    
    // Remove whitespace from chat message
    const commandName = lowerCaseMsg.trim().split(' ');

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
        case '!faq':
            handleFAQ(target);
            break;
        case '!socials':
            handleSocials(target);
            break;
        case '!timeout':
            if (commandName.length === 3) {
                const username = commandName[1].startsWith('@') ? commandName[1].substring(1) : commandName[1];
                const duration = parseInt(commandName[2], 10);

                if (!isNaN(duration)) {
                    client.timeout(target, username, duration)
                        .then(() => {
                            client.say(target, `@${username} has been timed out for ${duration} seconds.`);
                        })
                        .catch((error) => {
                            console.error(`Failed to timeout user: ${error}`);
                        });
                } else {
                    client.say(target, `Invalid duration. Please enter a number of seconds.`);
                }
            } else {
                client.say(target, `Usage: !timeout <username> <duration in seconds>`);
            }
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
function handleFAQ(channel) {
    client.say(channel, "FAQ: I'm 20, from Minnesota, go to SMU, CS major!");
}

//!Socials (link to linkedin bc professional)
function handleSocials(channel) {
    client.say(channel, "Check out my LinkedIn to connect professionally: [https://www.linkedin.com/in/matthewvirginia/]");
}

// Listen for messages in the chat
client.on("chat", (channel, user, message, self) => {
    if (self) return; //Ignore messages from the bot itself

    const username = user['username']; //Get the username of the message sender

    //Initialize offenses for new users
    if (!userOffenses[username]) {
        userOffenses[username] = 0;
    }

    //Check messages for offensive content or specific commands to trigger offenses
    if (message.includes('offensive_word')) {
        //Increment the offense count for the user
        userOffenses[username]++;

        //Apply timeouts based on the number of offenses
        switch (userOffenses[username]) {
            case 1:
                client.timeout(channel, username, 600); //1st offense: 10 minutes timeout
                client.say(channel, `@${username}, you've been timed out for 10 minutes for your 1st offense.`);
                break;
            case 2:
                client.timeout(channel, username, 86400); //2nd offense: 24 hours timeout
                client.say(channel, `@${username}, you've been timed out for 24 hours for your 2nd offense.`);
                break;
            case 3:
                client.ban(channel, username); //3rd offense: Permanent ban
                client.say(channel, `@${username}, you've been permanently banned for repeated offenses.`);
                break;
            default:
                break;
        }
    }
});
