(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{118:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),o=a(52),r=a.n(o),c=(a(65),a(8)),i=a.n(c),m=a(25),l=a(53),u=a(54),h=a(58),p=a(55),d=a(59),v=a(56),f=a.n(v),b=(a(68),function(e){function t(){var e;if(Object(l.a)(this,t),(e=Object(h.a)(this,Object(p.a)(t).call(this))).token="a55e3035-4bc7-4d7e-92a1-06e8cad95684",e.state={time:Date.now(),id:void 0,status:"None",reason:"",member:void 0,voices:[],count:0},e.member=e.getmember(),void 0===e.voices||e.voices===[])var a=setInterval(function(){e.voices=speechSynthesis.getVoices(),e.voices.length>0&&(e.setState({voices:e.voices}),clearInterval(a))},100);return e}return Object(d.a)(t,e),Object(u.a)(t,[{key:"getmember",value:function(){var e=Object(m.a)(i.a.mark(function e(){var t=this;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return"https://cors-anywhere.herokuapp.com/https://fabman.io/api/v1/members?limit=1000",e.next=3,fetch("https://cors-anywhere.herokuapp.com/https://fabman.io/api/v1/members?limit=1000",{async:!0,crossDomain:!0,method:"GET",headers:{Authorization:"Bearer a55e3035-4bc7-4d7e-92a1-06e8cad95684","cache-control":"no-cache","Postman-Token":"e12b6f6f-286d-4b6c-9faa-e85839d5cad7"}}).then(function(){var e=Object(m.a)(i.a.mark(function e(a){var n,s;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.json();case 2:for(n=e.sent,t.memberMap={},s=0;s<n.length;s++)t.memberMap[n[s].id]=n[s].firstName+" "+n[s].lastName;return e.abrupt("return",n);case 6:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),function(e){return console.error("Member Fetch Error"),{}});case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()},{key:"callApi",value:function(){var e=this;fetch("https://cors-anywhere.herokuapp.com/https://fabman.io/api/v1/resource-logs?account=288&space=0&resource=834&status=all&order=desc&limit=50",{async:!0,crossDomain:!0,method:"GET",headers:{Authorization:"Bearer a55e3035-4bc7-4d7e-92a1-06e8cad95684","cache-control":"no-cache","Postman-Token":"e12b6f6f-286d-4b6c-9faa-e85839d5cad7"}}).then(function(){var t=Object(m.a)(i.a.mark(function t(a){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a.json().then(function(t){Date.now()-Date.parse(t[0].createdAt)>3e3?e.setState({time:Date.now(),id:void 0,status:"None",reason:"",member:void 0,count:0}):"denied"===t[0].type?e.setState({time:Date.now(),id:t[0].id,status:"Denied",reason:t[0].reason,member:t[0].member},function(){if(void 0!==e.state.member&&0===e.state.count){var t=new SpeechSynthesisUtterance("I cannot recognize this key, Please contact the staff member!");t.voice=e.state.voices[0],t.lang=e.state.voices[0].lang,window.speechSynthesis.speak(t),e.setState({count:1})}}):"allowed"===t[0].type?e.setState({time:Date.now(),id:t[0].id,status:"Allowed",reason:t[0].reason,member:t[0].member},function(){if(void 0!==e.state.member&&0===e.state.count){var t=new SpeechSynthesisUtterance("Welcome, "+e.memberMap[e.state.member]+". Enjoy your time here!");t.voice=e.state.voices[0],t.lang=e.state.voices[0].lang,window.speechSynthesis.speak(t),e.setState({count:1})}}):e.setState({time:Date.now(),id:void 0,status:"None",reason:"",member:void 0,count:0})});case 2:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),function(e){console.log(e)})}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"componentDidMount",value:function(){var e=this;this.interval=setInterval(function(){e.callApi()},1e3)}},{key:"render",value:function(){return s.a.createElement("div",{className:"App",style:{backgroundColor:"None"===this.state.status?"#4b2e83":"Allowed"===this.state.status?"#068912":"#b50600"}},s.a.createElement("div",{className:"logo_div pt-3"},s.a.createElement("img",{className:"logo",src:f.a})),s.a.createElement("h1",null,"CoMotion MakerSpace Check In"),s.a.createElement("hr",{className:"my-5"}),s.a.createElement("div",{className:"None"===this.state.status?"":"collapse"},s.a.createElement("h2",null,"Welcome to the CoMotion MakerSpace"),s.a.createElement("h4",null,"Please tap your card before you enter."),s.a.createElement("h1",null,"Happy Making!")),s.a.createElement("div",{className:"None"===this.state.status?"collapse":""},s.a.createElement("h2",null,"Status: ",this.state.status),s.a.createElement("h2",{className:"Denied"!==this.state.status?"collapse":""},"Reason: ","unknownKey"===this.state.reason?"Key not recognized.":this.state.reason),s.a.createElement("h2",{className:"Denied"===this.state.status?"collapse":""},"Welcome, ",s.a.createElement("span",{className:"cap"},void 0!==this.state.member&&void 0!==this.memberMap?this.memberMap[this.state.member]:null))))}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var w=a(57),k=a.n(w);a(115);k.a.initializeApp({apiKey:"AIzaSyB41H1SpaxmB8n8vTehgYjIXctza7h4fKM",authDomain:"makerspace-checkin.firebaseapp.com",databaseURL:"https://makerspace-checkin.firebaseio.com",projectId:"makerspace-checkin",storageBucket:"makerspace-checkin.appspot.com",messagingSenderId:"860377247752"}),r.a.render(s.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},56:function(e,t,a){e.exports=a.p+"static/media/logo.5723d5a7.png"},60:function(e,t,a){e.exports=a(118)},65:function(e,t,a){},68:function(e,t,a){}},[[60,1,2]]]);
//# sourceMappingURL=main.9d64cd33.chunk.js.map