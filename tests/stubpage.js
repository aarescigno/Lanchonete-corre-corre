
(function(){
 const data={'ranking-carreira/u_1':{nome:'Marina',pontos:2480,dia:6,quando:'2026-10-14T12:00:00Z'},'ranking-carreira/u_2':{nome:'Seu Nicolau',pontos:1310,dia:4,quando:'2026-10-14T12:00:00Z'},'ranking-carreira/u_3':{nome:'Paula',pontos:3720,dia:7,quando:'2026-10-14T12:00:00Z'},'ranking-carreira/u_me':{nome:'Arthur',pontos:1900,dia:5,quando:'2026-10-14T12:00:00Z'}};
 function col(p){return p.split('/').slice(0,-1).join('/');}
 function snap(p){const d=data[p];return{id:p.split('/').pop(),exists:d!==undefined,data:()=>d};}
 function query(c,st){st=st||{};return{orderBy(f,d){return query(c,{...st,ob:f,dir:d})},limit(n){return query(c,{...st,lim:n})},
  onSnapshot(next){const docs=Object.keys(data).filter(p=>col(p)===c).map(snap); if(st.ob) docs.sort((a,b)=>st.dir==='desc'?b.data()[st.ob]-a.data()[st.ob]:a.data()[st.ob]-b.data()[st.ob]); setTimeout(()=>next({docs,size:docs.length,empty:!docs.length}),20); return ()=>{};}}}
 const db={doc(p){return{get:async()=>snap(p),set:async d=>{data[p]=d},update:async d=>{Object.assign(data[p],d)}}},collection(c){const q=query(c);q.doc=id=>db.doc(c+'/'+id);return q;}};
 window.claude={use:async n=>n==='db'?db:n==='user'?{id:async()=>'u_me'}:null};
})();
