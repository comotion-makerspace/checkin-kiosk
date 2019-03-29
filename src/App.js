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
        if(this.voices.length > 0){
          this.setState({voices:this.voices});
          clearInterval(mytimer);
        }
    }, 100);
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
    });

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
          }else if(data[0].type==="allowed"){
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
    if(this.state.member!==undefined && this.state.count === 0){
      let voice_index = [0,48,49,50]
      var utterance = new SpeechSynthesisUtterance("Welcome, "+this.memberMap[this.state.member]+"");
      utterance.voice = this.state.voices[voice_index[Math.floor(Math.random()*4)]];
      utterance.lang = this.state.voices[0].lang;
      speechSynthesis.speak(utterance);
      this.setState({count:1})
    }
  }else{
    if(this.state.count === 0){
    let voice_index = [0,48,49,50]
    var utterance = new SpeechSynthesisUtterance("I cannot recognize this key, Please contact the staff member!");
    utterance.voice = this.state.voices[voice_index[Math.floor(Math.random()*4)]];
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

    this.new_interval = setInterval(()=>{
      this.member =this.getmember();
    },216000000);
  }


  render() {
    return (
      <div className="App" style={{backgroundColor:this.state.status==="None"?"#4b2e83":this.state.status==="Allowed"?"#068912":"#b50600"}}>
      <div className="logo_div pt-3">
      <img className="logo" src={logo}></img>
      </div>
      <h1 >CoMotion MakerSpace Check In</h1>

      <hr className="my-5"></hr>
      <button className="d-none" ref={this.appref} onClick={this.handleSpeak.bind(this)}></button>
      <div className={this.state.status==="None"?"":"collapse"}>
        <h4>Welcome to the CoMotion MakerSpace</h4>
        <h1>Please tap your card before you enter.</h1>
       
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
      this.events = this.props.events.slice(0,3)
    }
    
    return(
      <>
      <h3 className="mt-3">Events: </h3>
      <ul>
        {this.props.events.length===0?<li>No Upcoming Events</li>
        :

        this.events.map(item=><li key={item}>{item.summary} @ <Moment format="dddd, MMM Do YYYY, h:mm:ss a" date={item.start} /> </li>)
        }

      </ul>
      </>
    );
  }
}

export default App;
