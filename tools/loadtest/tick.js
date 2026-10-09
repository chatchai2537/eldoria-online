// ใส่ด้วย node -r tools/loadtest/tick.js server.js เพื่อพิมพ์ความหน่วง event loop (LAG) ทุก 4 วิ
// measure event-loop: run inside server via -r preload: log avg setInterval drift
const t0={n:0,sum:0,max:0};let last=Date.now();setInterval(()=>{const now=Date.now(),d=now-last-50;last=now;if(d>0){t0.sum+=d;t0.max=Math.max(t0.max,d)}t0.n++},50);
setInterval(()=>{console.log('LAG avg',(t0.sum/t0.n).toFixed(1),'max',t0.max,'cpu',JSON.stringify(process.cpuUsage()));t0.n=0;t0.sum=0;t0.max=0},4000);
