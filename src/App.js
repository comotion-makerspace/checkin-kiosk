import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

import Moment from 'react-moment';
const ical = require('ical');

class App extends Component {
  constructor(){
    super();
    this.token= "a55e3035-4bc7-4d7e-92a1-06e8cad95684";
    this.appref = React.createRef();
    this.state={
      time: Date.now(),
      id:undefined,
      status: "None",
      reason:"",
      member:undefined,
      voices : [],
      count :0
    }
    this.member =this.getmember();
    if(this.voices ===undefined || this.voices === []){
      let mytimer = setInterval(()=> {
        this.voices = speechSynthesis.getVoices();
        if(this.voices != undefined &&this.voices.length > 0 ){
          this.setState({voices:this.voices});
          clearInterval(mytimer);
        }
    }, 500);
    }
    
  }

  async getmember(){
    let url="https://cors-anywhere.herokuapp.com/https://fabman.io/api/v1/members?limit=1000";
    await fetch(url,{
      "async": true,
  "crossDomain": true ,
  "method": "GET",
  "headers": {
    "Authorization": "Bearer a55e3035-4bc7-4d7e-92a1-06e8cad95684",
    "cache-control": "no-cache",
    "Postman-Token": "e12b6f6f-286d-4b6c-9faa-e85839d5cad7"
  }
    }).then(async (res)=>{
      let data = await res.json();
      this.memberMap = {}
    for(let i=0;i<data.length;i++){
      this.memberMap[data[i].id] = data[i].firstName//+" "+data[i].lastName
    }
      return(data);
    },(err)=>{
      console.error("Member Fetch Error");
      return({});
    })
  }

  callApi(){
    let url = "https://cors-anywhere.herokuapp.com/https://fabman.io/api/v1/resource-logs?account=288&space=0&resource=834&status=all&order=desc&limit=50"
    fetch(url,{
      "async": true,
  "crossDomain": true ,
  "method": "GET",
  "headers": {
    "Authorization": "Bearer a55e3035-4bc7-4d7e-92a1-06e8cad95684",
    "cache-control": "no-cache",
    "Postman-Token": "e12b6f6f-286d-4b6c-9faa-e85839d5cad7"
  }
    }).then(
      async (response)=>{
        await response.json().then((data)=>
        {
          if(new Date().getTime() - new Date(data[0].createdAt).getTime() > 5000){
            this.setState({
              time: Date.now(),
              id:undefined,
              status: "None",
              reason:"",
              member:undefined,
              count:0
            });
          }
          else if (data[0].type==="denied"){
            this.setState({
              time: Date.now(),
              id:data[0].id,
              status: "Denied",
              reason:data[0].reason,
              member:data[0].member
            },()=>{
              this.appref.current.click();
              });
          }else if(data[0].type==="allowed"||data[0].type==="keyAssigned"){
            this.setState({
              time: Date.now(),
              id:data[0].id,
              status: "Allowed",
              reason:data[0].reason,
              member:data[0].member
            },()=>{
              this.appref.current.click();
          }
            );
          }else {
            this.setState({
              time: Date.now(),
              id:undefined,
              status: "None",
              reason:"",
              member:undefined,
              count:0
            });
          }
        }
        );
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  handleSpeak(){
    if (this.state.status === "Allowed"){
	let name = this.memberMap[this.state.member]
	let choices = [
"Welcome "+this.memberMap[this.state.member]+".",
"Greetings, "+this.memberMap[this.state.member]+".",
"Hello there, "+this.memberMap[this.state.member]+".",
"Access granted, "+this.memberMap[this.state.member]+".",
"Happy making, "+this.memberMap[this.state.member]+".",
"Salutations, "+this.memberMap[this.state.member]+".",
"It’s showtime, "+this.memberMap[this.state.member]+".",
"Shall we play a game, "+this.memberMap[this.state.member]+".",
"Resistance is futile, "+this.memberMap[this.state.member]+".",
"Thank you for your cooperation, "+this.memberMap[this.state.member]+".",
"Great scott, it's "+this.memberMap[this.state.member]+".",
"Ahoy, "+this.memberMap[this.state.member]+".",
"Howdy, "+this.memberMap[this.state.member]+".",
"Hello "+this.memberMap[this.state.member]+", if that’s even your real name.",
"Hewwo "+this.memberMap[this.state.member]+".",
"Clear the way, it's "+this.memberMap[this.state.member]+"!",
"OK, everyone! Let's greet "+this.memberMap[this.state.member]+".",
"Watch out, it's "+this.memberMap[this.state.member]+".",
"Always nice to see you, "+this.memberMap[this.state.member]+".",
"Pick your jaw up off the floor, it's just "+this.memberMap[this.state.member]+".",
"Laser defences deactivated. Welcome, agent "+this.memberMap[this.state.member]+".",
"Congratulations "+this.memberMap[this.state.member]+", you've passed the Turing test.", 
];
	
    if(this.state.member!==undefined && this.state.count === 0){
      let voice_index = [0,1,3,4,5]
      var utterance = new SpeechSynthesisUtterance(choices[Math.floor(Math.random()*choices.length)]);
      utterance.voice = this.state.voices[voice_index[Math.floor(Math.random()*5)]];
      console.log(voice_index[Math.floor(Math.random()*4)])
      utterance.lang = this.state.voices[0].lang;
      speechSynthesis.speak(utterance);
      this.setState({count:1})
    }
  }else{
    if(this.state.count === 0){
    let voice_index = [0,1,3,4,5]
    var utterance = new SpeechSynthesisUtterance("I cannot recognize this key, Please contact the staff member!");
    utterance.voice = this.state.voices[voice_index[Math.floor(Math.random()*5)]];
    utterance.lang = this.state.voices[0].lang;
    speechSynthesis.speak(utterance);
    this.setState({count:1})
  }
}
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.callApi();
    }, 1000);
    if(this.events === undefined){
      ical.fromURL('https://cors-anywhere.herokuapp.com/https://www.trumba.com/service/sea_makerspace.ics', {},  (err, data)=> {
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
      });
    }
    this.new_interval = setInterval(()=>{
      this.member =this.getmember();
      ical.fromURL('https://cors-anywhere.herokuapp.com/https://www.trumba.com/service/sea_makerspace.ics', {},  (err, data)=> {
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
      });
    },216000000);
  }


  render() {
    return (
      <div className="App" style={{backgroundColor:this.state.status==="None"?"#4b2e83":this.state.status==="Allowed"?"#068912":"#b50600"}}>
      <div className="logo_div pt-3">
      <img className="logo" src={logo}></img>
      </div>
      <h1>Welcome to CoMotion MakerSpace!</h1>

      <hr className="my-5"></hr>
      <button className="d-none" ref={this.appref} onClick={this.handleSpeak.bind(this)}></button>
      <div className={this.state.status==="None"?"":"collapse"}>
        <h2>Please tap your card before entering.</h2>
       
      </div>
      <div className={this.state.status==="None"?"collapse":""}>
      <h2 className="collapse">{this.state.status}</h2>
      <h2 className={this.state.status!=="Denied"?"collapse":""}>Reason: {this.state.reason==="unknownKey"?"Key not recognized.":this.state.reason}</h2>
      <h2 className={this.state.status==="Denied"?"collapse":""}>
      Welcome, <span className="cap">{this.state.member!==undefined && this.memberMap !==undefined?this.memberMap[this.state.member]:null}</span>
      </h2>
      <h1 className={this.state.status==="Denied"?"collapse":""}>Happy Making!</h1>
      
      </div>
      <div class="trumba_frame mt-3" role="region" aria-labelledby="upcoming_events">
      {(this.events !== undefined)?<Events events={this.events}></Events>:<></>
      }
        </div>
      </div>
    );
  }
}

class Events extends Component{
  
  render(){
    if(this.props.events.length!==0){
      this.events = this.props.events.slice(0,4);
      this.event_loc = {}
      this.events.map(item=>this.event_loc[item.summary] = ((item["TRUMBA-CUSTOMFIELD"].filter(item=>item.params.NAME==="\"Campus location\"" || item.params.NAME==="\"Campus room\"")).map(item=>item.val).join()))
    }
   
    
    return(
      <>
      <table className="table">
        {this.props.events.length===0?<tr><td>No Upcoming Events</td></tr>
        :

        // this.events.map(item=><tr><td>{item.summary} @ {this.event_loc[item.summary]}  on <Moment format="dddd, MMM Do YYYY, h:mm a" date={item.start}></Moment></td></tr>)
        this.events.map(item=><td><span class="time"><Moment format="MMM D, h:mm a" date={item.start}></Moment></span><br/><span class="event">{item.summary}</span><br/><span class="location">{this.event_loc[item.summary]}</span></td>)
        }

      </table>
      </>
    );
  }
}

export default App;
