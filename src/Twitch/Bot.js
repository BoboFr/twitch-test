const tmi = require("tmi.js");
const EE = require('events');

let options = {
    options: {
        debug: false
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: "Bobot_bot",
        password: "XXX"
    },
    channels: [ "#thegetget" ]
};

class Bot extends EE{
    client = new tmi.client(options);
    pool = "lol";
    constructor(){
        super();
        this.client.connect();
        this.events = new EE();

        this.state = {
            pool: false,
            users: [],
            winner: ''
        };
        this.client.on('chat', (channel, userstate, message, self) => {
            if(self) return;
            if(message === '!giveaway' && this.state.pool && this.state.winner.length === 0){
                if(this.state.users.indexOf(userstate['display-name']) === -1){
                    this.state.users.push(userstate['display-name']);
                    fetch(`https://api.twitch.tv/kraken/channels/${userstate['display-name']}`, {
                        headers: {
                            'Client-ID': 'XXX'
                        }
                    })
                    .then(res => res.json())
                    .then(res => {
                        this.emit('new_user', {username: userstate['display-name'], logo: res.logo, color: userstate.color});
                    })
                }
            }

            if(userstate['display-name'] == this.state.winner){
                this.emit('winner_say', message);
            }
        });
        this.client.on('connected', (address, port) => {
            this.emit('connected');
        })
    }

    EnablePoolGiveaway(){
        this.state = {
            pool: !this.state.pool,
            users: [...this.state.users],
            winner: ''
        };
        if(this.state.pool){
            this.client.say('#thegetget', '🎁 Le tirage au sort est lancé, écrivez !giveaway');
        }
    }

    resetPool(){
        this.state.users = [];
    }

    pickWinner(){
        var winner = this.state.users[Math.floor(Math.random() * this.state.users.length)];
        this.client.say('#thegetget', `🎆 Le gagnant est ${winner}, écris vite un message dans le chat pour réclamer ton bien.`);
        this.emit('winner', winner);
        this.state.winner = winner;
    }
}

export default new Bot();