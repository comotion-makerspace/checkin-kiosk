import React, { Component } from 'react';
import socketIO from 'socket.io-client'
import logo from './logo.png';
import './App.css';
import Moment from 'react-moment';
const ical = require('ical');

class App extends Component {
  constructor(){
    super();
    this.token= process.env.REACT_APP_TOKEN;
    this.appref = React.createRef();
    this.state={
      time: Date.now(),
      id: undefined,
      status: "None",
      reason: "",
      member: undefined,
      voices : [],
      count : 0
    }
    if(this.voices === undefined || this.voices === []){
      console.log('creating voices...')
      let mytimer = setInterval( () => {
        this.voices = speechSynthesis.getVoices();
        if(this.voices !== undefined && this.voices.length > 0 ){
          this.setState({voices:this.voices});
          clearInterval(mytimer);
        }
    }, 500);
    }
  }

  handleSpeak(){
    let name = this.state.member;
    let status = this.state.status;
    console.log('NAME: ' + name + ', ACCESS: ' + status);
    let voice_index = [0,1,3,4,5];
    let utterance;
    let choices = [];

    switch(status) {
      case ('allowed'):
        choices = [
              "Welcome "+name+".",
              "Greetings, "+name+".",
              "Hello there, "+name+".",
              "Access granted, "+name+".",
              "Happy making, "+name+".",
              "Salutations, "+name+".",
              "It's showtime, "+name+".",
              "Shall we play a game, "+name+".",
              "Resistance is futile, "+name+".",
              "Thank you for your cooperation, "+name+".",
              "Great scott, it's "+name+".",
              "Ahoy, "+name+".",
              "Howdy, "+name+".",
              "Hello "+name+", if that's even your real name.",
              "Hewwo "+name+".",
              "Clear the way, it's "+name+"!",
              "OK, everyone! Let's greet "+name+".",
              "Watch out, it's "+name+".",
              "Always nice to see you, "+name+".",
              "Pick your jaw up off the floor, it's just "+name+".",
              "Laser defences deactivated. Welcome, agent "+name+".",
              "Congratulations "+name+", you've passed the Turing test.", 
            ];
        utterance = new SpeechSynthesisUtterance(choices[Math.floor(Math.random()*choices.length)]);
        break;

      case('keyAssigned'):
        choices = [
          name + ', you are hereby officially welcomed to the CoMotion MakerSpace!',
          name + ', We\'re so happy to have you here at the CoMotion MakerSpace!',
          name + ', You\'ve now completed all the steps to become a part of the CoMotion MakerSpace! Now, go forth and make!'
        ];
        utterance = new SpeechSynthesisUtterance(choices[Math.floor(Math.random()*choices.length)]);
        break;
      default:
        utterance = new SpeechSynthesisUtterance("Please contact a staff member for assistance!");
        break;
      }
    console.log('speaking...');
    utterance.lang = this.state.voices[0].lang;
    utterance.voice = this.state.voices[voice_index[Math.floor(Math.random()*5)]];
    speechSynthesis.speak(utterance);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    /* socket.io */
    const socket = socketIO('http://127.0.0.1:5000', {      
        transports: ['websocket'], jsonp: false });   
        socket.connect(); 
        socket.on('connect', () => { 
          console.log('connected to socketio server'); 
        });
        socket.on('member check-in', (msg) => {
          try {
            let name = msg['data'][0]
            let access = msg['data'][1]
            this.setState({ member: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), 
                            status: access
                          });
            this.appref.current.click();
            // revert state after 5 seconds
            setTimeout(function() {
              this.setState({ member: undefined, 
                              status: "None"
                            });            
            }.bind(this), 5000)
          } catch(e) {
            // don't do anything...
          }
        });

    if(this.events === undefined){
      ical.fromURL(process.env.REACT_APP_CORS_URL + '/' + process.env.REACT_APP_TRUMBA_URL, {},  (err, data)=> {
      this.events = [];
        for (let k in data) {
            var ev = data[k];
            if (data[k].type === 'VEVENT') {
                  if(ev.start >= new Date() && ev.start <= new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000)){
                    this.events.push(ev)
                  } 
            }
        }
        this.events = this.events.sort((a,b)=>{
          return a.start - b.start
        })
        this.setState({events:this.events});
      });
    }
    this.new_interval = setInterval(()=>{
      ical.fromURL(process.env.REACT_APP_CORS_URL + '/' + process.env.REACT_APP_TRUMBA_URL, {},  (err, data)=> {
      this.events = [];
        for (let k in data) {
            var ev = data[k];
            if (data[k].type === 'VEVENT') {
                  if(ev.start >= new Date() && ev.start <= new Date(new Date().getTime() + 40 * 24 * 60 * 60 * 1000)){
                    this.events.push(ev)
                  } 
            }
        }
        this.events = this.events.sort((a,b)=>{
          return a.start - b.start
        })
        this.setState({events:this.events});
      });
    },216000000);
  }


  render() {
    return (
      <div className="App" style={{backgroundColor:this.state.status==="None"?"#4b2e83":(this.state.status==="allowed" || this.state.status==="keyAssigned")?"#068912":"#b50600"}}>
      <div className="logo_div pt-3">
      <img className="logo" src={logo} alt=""></img>
      </div>
      <h1>Welcome to the CoMotion MakerSpace!</h1>

      <hr className="my-5"></hr>
      <button className="d-none" ref={this.appref} onClick={this.handleSpeak.bind(this)}></button>
      <div className={this.state.status==="None"?"":"collapse"}>
        <h2>Please tap your card on the device below before entering.</h2>
      </div>
      <div className={this.state.status==="None"?"collapse":""}>
      <h2 className="collapse">{this.state.status}</h2>
      <h2 className={this.state.status!=="denied"?"collapse":""}>Please contact a staff member for assistance.{this.state.reason==="unknownKey"?"Key not recognized.":this.state.reason}</h2>
      <h2 className={this.state.status==="denied"?"collapse":""}>
      Welcome, <span className="cap">{this.state.member !== undefined ? this.state.member : null}</span>
      {/* Welcome, <span className="cap">{this.state.member!== undefined && this.memberMap !== undefined ? this.memberMap[this.state.member] : null}</span> */}
      </h2>
      <h1 className={this.state.status==="denied"?"collapse":""}>Happy Making!</h1>
      
      </div>
      <div className="trumba_frame mt-3" role="region" aria-labelledby="upcoming_events">
      {(this.events !== undefined)?<Events events={this.events}></Events>:<></>
      }
        </div>
      </div>
    );
  }
}

class Events extends Component{
    render(){
        if(this.props.events.length !== 0){
            console.log('rendering events...');
            this.events = this.props.events.slice(0,4);
            this.event_loc = {}
            this.events.map(item=>this.event_loc[item.summary] = ((item["TRUMBA-CUSTOMFIELD"].filter(item=>item.params.NAME==="\"Campus location\"" || item.params.NAME==="\"Campus room\"")).map(item=>item.val).join()))
        } else {
            console.log('no events to display, not rendering');
        }

    return(
      <>
      <table className="table">
        {this.props.events.length === 0 ? <tr><td>No Upcoming Events to Display</td></tr> :
        // this.events.map(item=><tr><td>{item.summary} @ {this.event_loc[item.summary]}  on <Moment format="dddd, MMM Do YYYY, h:mm a" date={item.start}></Moment></td></tr>)
        this.events.map(item=><td><span class="time"><Moment format="MMM D, h:mm a" date={item.start}></Moment></span><br/><span class="event">{item.summary}</span><br/><span class="location">{this.event_loc[item.summary]}</span></td>)
        }

      </table>
      </>
    );
  }
}

export default App;