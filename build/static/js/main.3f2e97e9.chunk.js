(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{24:function(e,t,a){e.exports=a(50)},29:function(e,t,a){},50:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(23),o=a.n(c),l=(a(29),a(3)),s=a(4),m=a(6),u=a(5),i=(a(7),function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){var e=this;return r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{className:"tableRowSeparator",colSpan:"13"})),this.props.customer.assignments&&this.props.customer.assignments.filter((function(e){return e.overview.length})).map((function(t,a){return r.a.createElement("tr",{key:t.employee.name},r.a.createElement("th",{scope:"row"},0===a?r.a.createElement("a",{href:e.props.customer.cardUrl,target:"_blank"},e.props.customer.name):""),t.overview.map((function(e,a){return r.a.createElement("td",{key:t.employee.name+a,title:e.hasAssignment?"".concat(t.employee.name," ").concat(t.startDate," \u2192 ").concat(t.endDate):"",colSpan:e.colSpan,className:e.hasAssignment?t.alert?"needContract":"onContract":"offContract"},e.hasAssignment?r.a.createElement("a",{href:t.employee.cardUrl,target:"_blank"},t.employee.name):"")})))})))}}]),a}(r.a.Component)),p=function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(l.a)(this,a),n=t.call(this,e);for(var r=["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],c=[],o=(new Date).getMonth(),s=0;s<12;s++)c.push(r[o]),o=o+1===12?0:o+1;return n.state={months:c},n}return Object(s.a)(a,[{key:"render",value:function(){return r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null),this.state.months.map((function(e){return r.a.createElement("th",{key:e,scope:"col"},e)})))),this.props.data.map((function(e){return r.a.createElement(i,{key:e.name,customer:e})})))}}]),a}(r.a.Component),h=function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){return this.props.employee.assignments.length?r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"row"},r.a.createElement("a",{href:this.props.employee.cardUrl,target:"_blank"},this.props.employee.name)),this.props.employee.assignments.map((function(e,t){var a;return r.a.createElement("td",{key:(null===(a=e.customer)||void 0===a?void 0:a.name)+t,title:e.customer?"".concat(e.customer.name," ").concat(e.startDate," \u2192 ").concat(e.endDate):"",colSpan:e.colSpan,className:e.customer?e.alert?"needContract":"onContract":"offContract"},e.customer?r.a.createElement("a",{href:e.customer.cardUrl,target:"_blank"},e.customer.name):"")})))):null}}]),a}(r.a.Component),d=function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(l.a)(this,a),n=t.call(this,e);for(var r=["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],c=[],o=(new Date).getMonth(),s=0;s<12;s++)c.push(r[o]),o=o+1===12?0:o+1;return n.state={months:c},n}return Object(s.a)(a,[{key:"render",value:function(){return r.a.createElement("table",{className:"employees"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null),this.state.months.map((function(e){return r.a.createElement("th",{key:e,scope:"col"},e)})))),r.a.createElement("tr",null,r.a.createElement("td",{className:"tableRowSeparator",colSpan:"13"})),this.props.data.map((function(e){return r.a.createElement(h,{key:e.name,employee:e})})))}}]),a}(r.a.Component),f=a(11),v=a.n(f),b=a(9),E=a(8),y=function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(l.a)(this,a);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(e=t.call.apply(t,[this].concat(r))).state={employees:[],customers:[],activeViewId:"customers"},e}return Object(s.a)(a,[{key:"setActiveViewId",value:function(e){this.setState({activeViewId:e})}},{key:"componentDidMount",value:function(){var e=this;v.a.get("http://localhost:5000/assignments").then((function(t){e.setState(t.data)}))}},{key:"resetCache",value:function(){v.a.get("http://localhost:5000/resetcache").then((function(e){console.log("cache reset"),window.location.reload()}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement("div",{id:"Menu",className:"btn-group"},r.a.createElement("a",{href:"#",onClick:function(){return e.setActiveViewId("customers")},className:"btn",title:"customer dashboard"},r.a.createElement(E.a,{icon:b.a})),r.a.createElement("a",{href:"#",onClick:function(){return e.setActiveViewId("employees")},className:"btn",title:"employee dashboard"},r.a.createElement(E.a,{icon:b.c})),r.a.createElement("a",{href:"#",onClick:this.resetCache,className:"btn",title:"reset cache"},r.a.createElement(E.a,{icon:b.b}))),function(){switch(e.state.activeViewId){case"customers":return r.a.createElement(p,{data:e.state.customers});case"employees":return r.a.createElement(d,{data:e.state.employees});default:return null}}())}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},7:function(e,t,a){}},[[24,1,2]]]);
//# sourceMappingURL=main.3f2e97e9.chunk.js.map