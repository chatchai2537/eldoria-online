// บอทจำลองผู้เล่น N คนในฉากเดียวกัน ส่งตำแหน่งทุก 100ms แล้ววัด snap/วิ และ KB/วิ/คน · ต้อง npm i ws ก่อน
// node tools/loadtest/load.js 1000   (เซิร์ฟเวอร์ต้องรันที่ ws://127.0.0.1:8799)
// N clients in one scene, random walk; measure snap sizes + latency
const WebSocket=require('ws');const N=+process.argv[2]||1000,URL='ws://127.0.0.1:8799';
let opened=0,snaps=0,bytes=0,maxPs=0,minPs=1e9;const cl=[];
for(let i=0;i<N;i++){setTimeout(()=>{const ws=new WebSocket(URL);const c={ws,x:Math.random()*4000,y:Math.random()*3000};cl.push(c);
 ws.on('open',()=>{opened++;ws.send(JSON.stringify({t:'hi',name:'bot'+i}))});
 ws.on('message',m=>{if(m.length>20&&m.toString('utf8',0,16).includes('"snap"')){snaps++;bytes+=m.length;const n=(m.toString().match(/"id":/g)||[]).length;maxPs=Math.max(maxPs,n);minPs=Math.min(minPs,n)}});
 ws.on('error',()=>{});},i*4)}
setInterval(()=>{for(const c of cl)if(c.ws.readyState===1){c.x+=Math.random()*20-10;c.y+=Math.random()*20-10;c.ws.send(JSON.stringify({t:'st',sc:'field',x:c.x,y:c.y,dir:'d',mv:true,lv:10,cls:'monk',armor:{sword:'sword0'},tier:{sword:0}}))}},100);
setTimeout(()=>{snaps=0;bytes=0;maxPs=0;minPs=1e9},8000);
setTimeout(()=>{console.log(JSON.stringify({N,opened,snapsPerSec:Math.round(snaps/5),kbPerClientPerSec:+(bytes/5/N/1024).toFixed(1),maxPs,minPs}));process.exit(0)},13000);
