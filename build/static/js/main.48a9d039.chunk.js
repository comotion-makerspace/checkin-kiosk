(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{234:function(e,t,a){e.exports=a.p+"static/media/logo.5723d5a7.png"},238:function(e,t,a){e.exports=a(533)},243:function(e,t,a){},268:function(e,t){},271:function(e,t,a){},288:function(e,t){},290:function(e,t){},321:function(e,t){},322:function(e,t){},369:function(e,t){},371:function(e,t){},394:function(e,t){},533:function(e,t,a){"use strict";a.r(t);var s=a(3),n=a.n(s),o=a(233),r=a.n(o),i=(a(243),a(134)),c=a(135),m=a(137),l=a(136),h=a(138),u=a(133),p=a.n(u),v=a(234),f=a.n(v),d=(a(271),a(235)),b=a.n(d),g=(a(273),a(275)),w=function(e){function t(){var e;if(Object(i.a)(this,t),(e=Object(m.a)(this,Object(l.a)(t).call(this))).token="a55e3035-4bc7-4d7e-92a1-06e8cad95684",e.appref=n.a.createRef(),e.state={time:Date.now(),id:void 0,status:"None",reason:"",member:void 0,voices:[],count:0},void 0===e.voices||e.voices===[])var a=setInterval(function(){e.voices=speechSynthesis.getVoices(),void 0!=e.voices&&e.voices.length>0&&(e.setState({voices:e.voices}),clearInterval(a))},500);return e}return Object(h.a)(t,e),Object(c.a)(t,[{key:"handleSpeak",value:function(){if("allowed"===this.state.status){this.state.member;var e=["Welcome "+this.state.member+".","Greetings, "+this.state.member+".","Hello there, "+this.state.member+".","Access granted, "+this.state.member+".","Happy making, "+this.state.member+".","Salutations, "+this.state.member+".","It\ufffds showtime, "+this.state.member+".","Shall we play a game, "+this.state.member+".","Resistance is futile, "+this.state.member+".","Thank you for your cooperation, "+this.state.member+".","Great scott, it's "+this.state.member+".","Ahoy, "+this.state.member+".","Howdy, "+this.state.member+".","Hello "+this.state.member+", if that\ufffds even your real name.","Hewwo "+this.state.member+".","Clear the way, it's "+this.state.member+"!","OK, everyone! Let's greet "+this.state.member+".","Watch out, it's "+this.state.member+".","Always nice to see you, "+this.state.member+".","Pick your jaw up off the floor, it's just "+this.state.member+".","Laser defences deactivated. Welcome, agent "+this.state.member+".","Congratulations "+this.state.member+", you've passed the Turing test."];if(void 0!==this.state.member&&0===this.state.count){var t=[0,1,3,4,5];(a=new SpeechSynthesisUtterance(e[Math.floor(Math.random()*e.length)])).voice=this.state.voices[t[Math.floor(5*Math.random())]],console.log(t[Math.floor(4*Math.random())]),a.lang=this.state.voices[0].lang,speechSynthesis.speak(a),this.setState({count:1})}}else if(0===this.state.count){var a;(a=new SpeechSynthesisUtterance("I cannot recognize this key, Please contact the staff member!")).voice=this.state.voices[[0,1,3,4,5][Math.floor(5*Math.random())]],a.lang=this.state.voices[0].lang,speechSynthesis.speak(a),this.setState({count:1})}}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"componentDidMount",value:function(){var e=this,t=p()("http://127.0.0.1:5000",{transports:["websocket"],jsonp:!1});t.connect(),t.on("connect",function(){console.log("connected to socketio server")}),t.on("member check-in",function(t){var a=t.data[0],s=t.data[1];e.setState({member:a.charAt(0).toUpperCase()+a.slice(1).toLowerCase(),status:s}),setTimeout(function(){this.setState({member:void 0,status:"None"})}.bind(e),5e3)}),void 0===this.events&&g.fromURL("https://cors-anywhere.herokuapp.com/https://www.trumba.com/service/sea_makerspace.ics",{},function(t,a){for(var s in e.events=[],a){var n=a[s];"VEVENT"===a[s].type&&n.start>=new Date&&n.start<=new Date((new Date).getTime()+3456e6)&&e.events.push(n)}e.events=e.events.sort(function(e,t){return e.start-t.start})}),this.new_interval=setInterval(function(){g.fromURL("https://cors-anywhere.herokuapp.com/https://www.trumba.com/service/sea_makerspace.ics",{},function(t,a){for(var s in e.events=[],a){var n=a[s];"VEVENT"===a[s].type&&n.start>=new Date&&n.start<=new Date((new Date).getTime()+3456e6)&&e.events.push(n)}e.events=e.events.sort(function(e,t){return e.start-t.start})})},216e6)}},{key:"render",value:function(){return n.a.createElement("div",{className:"App",style:{backgroundColor:"None"===this.state.status?"#4b2e83":"allowed"===this.state.status?"#068912":"#b50600"}},n.a.createElement("div",{className:"logo_div pt-3"},n.a.createElement("img",{className:"logo",src:f.a})),n.a.createElement("h1",null,"Welcome to the CoMotion MakerSpace!"),n.a.createElement("hr",{className:"my-5"}),n.a.createElement("button",{className:"d-none",ref:this.appref,onClick:this.handleSpeak.bind(this)}),n.a.createElement("div",{className:"None"===this.state.status?"":"collapse"},n.a.createElement("h2",null,"Please tap your card before entering.")),n.a.createElement("div",{className:"None"===this.state.status?"collapse":""},n.a.createElement("h2",{className:"collapse"},this.state.status),n.a.createElement("h2",{className:"denied"!==this.state.status?"collapse":""},"Please contact a staff member for assistance. ","unknownKey"===this.state.reason?"Key not recognized.":this.state.reason),n.a.createElement("h2",{className:"denied"===this.state.status?"collapse":""},"Welcome, ",n.a.createElement("span",{className:"cap"},void 0!==this.state.member?this.state.member:null)),n.a.createElement("h1",{className:"denied"===this.state.status?"collapse":""},"Happy Making!")),n.a.createElement("div",{class:"trumba_frame mt-3",role:"region","aria-labelledby":"upcoming_events"},void 0!==this.events?n.a.createElement(y,{events:this.events}):n.a.createElement(n.a.Fragment,null)))}}]),t}(s.Component),y=function(e){function t(){return Object(i.a)(this,t),Object(m.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return 0!==this.props.events.length&&(this.events=this.props.events.slice(0,4),this.event_loc={},this.events.map(function(t){return e.event_loc[t.summary]=t["TRUMBA-CUSTOMFIELD"].filter(function(e){return'"Campus location"'===e.params.NAME||'"Campus room"'===e.params.NAME}).map(function(e){return e.val}).join()})),n.a.createElement(n.a.Fragment,null,n.a.createElement("table",{className:"table"},0===this.props.events.length?n.a.createElement("tr",null,n.a.createElement("td",null,"No Upcoming Events")):this.events.map(function(t){return n.a.createElement("td",null,n.a.createElement("span",{class:"time"},n.a.createElement(b.a,{format:"MMM D, h:mm a",date:t.start})),n.a.createElement("br",null),n.a.createElement("span",{class:"event"},t.summary),n.a.createElement("br",null),n.a.createElement("span",{class:"location"},e.event_loc[t.summary]))})))}}]),t}(s.Component),k=w;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var E=a(237),N=a.n(E);a(529);N.a.initializeApp({apiKey:"AIzaSyB41H1SpaxmB8n8vTehgYjIXctza7h4fKM",authDomain:"makerspace-checkin.firebaseapp.com",databaseURL:"https://makerspace-checkin.firebaseio.com",projectId:"makerspace-checkin",storageBucket:"makerspace-checkin.appspot.com",messagingSenderId:"860377247752"}),r.a.render(n.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[238,1,2]]]);
//# sourceMappingURL=main.48a9d039.chunk.js.map