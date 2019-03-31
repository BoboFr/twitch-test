import React, { Component } from 'react';
import { Container, Header, Icon, Segment, Checkbox, Button, List,Image } from 'semantic-ui-react';

import Bot from './Twitch/Bot';

class App extends Component {
  constructor(){
    super();
    Bot.on('new_user', (user) => {
      this.setState({
        users: [...this.state.users, user]
      })
    });
    Bot.on('winner', (winnerName) => {
      this.setState({
        winner: winnerName
      });
    });
    Bot.on('winner_say', (message) => {
      this.setState({
        winnerMessages: [...this.state.winnerMessages, message]
      });
    });

    Bot.on('connected', () => {
      this.setState({
        tmiConnected: true
      })
    })

    this.state = {
      poolEnable: false,
      poolMessage: 'Activer le tirage au sort',
      users: [],
      winner: '',
      winnerPicked: false,
      winnerMessages: [],
      tmiConnected : false
    }

    this.togglePool = this.togglePool.bind(this);
    this.restartPool = this.restartPool.bind(this);
    this.pickWinner = this.pickWinner.bind(this);
  }

  togglePool(){
    this.setState({
      poolEnable: !this.state.poolEnable
    });
    Bot.EnablePoolGiveaway();
  }
  restartPool() {
    this.setState({
      users: [],
      winner: '',
      winnerMessages: [],
      winnerPicked: false
    });
    Bot.resetPool();
  }

  pickWinner(){
      Bot.pickWinner();
      this.setState({
        winnerPicked: true
      });
  }

  render() {
    return ( 
    <Container>
      <Header as='h2' icon textAlign='center'>
        <Icon name='users' circular />
        <Header.Content>Tirage au sort</Header.Content>
      </Header>
      <Segment>
        <Header as='h3'>
          Liste des participants
          <div>
            <Checkbox label={this.state.poolMessage} toggle disabled={!this.state.tmiConnected} onChange={this.togglePool}/>
            <Button primary style={{marginLeft: 20}} disabled={!this.state.poolEnable || this.state.users.length == 0} onClick={this.pickWinner}>Tirer un gagnant</Button>
            <Button style={{marginLeft: 20}} color='red' onClick={this.restartPool}>Remise à zéro du giveaway</Button>
          </div>
        </Header>
        <Header textAlign='center' color='green' as='h1'>{this.state.winner}</Header>
        <List>
          {Object.keys(this.state.users).map((item, i) => {
            return (
              <List.Item key={i}>
                <Image avatar src={this.state.users[i].logo} verticalAlign='middle' />
                <List.Content style={{marginTop: 5}}>
                  <span style={{color: this.state.users[i].color, fontWeight: 'bold'}}>{this.state.users[i].username}</span>
                </List.Content>
              </List.Item>
              )
          })}
        </List>
      </Segment>
      {this.state.winnerPicked &&
        <Segment>
          {this.state.winnerMessages.length > 0 &&
            <Header as='h2' color='purple'>Présent !</Header>
          }
          <List>
          {Object.keys(this.state.winnerMessages).map((item, i) => {
            return (
              <List.Item key={i}>
                <List.Content>{this.state.winner} : {this.state.winnerMessages[i]}</List.Content>
              </List.Item>
              )
          })}
        </List>
        </Segment>
      }
    </Container>
    );
  }
}

export default App;
