#!/bin/sh
# วัดเซิร์ฟเวอร์ใต้โหลด: sh tools/loadtest/bench.sh 1000   (รันจากโฟลเดอร์ repo · ต้อง npm i ws)
N=${1:-600}; DATA_DIR=/tmp/eldoria-bench MAX_PER_IP=5000 PORT=8799 node -r ./tools/loadtest/tick.js server.js > /tmp/eldoria-bench.log 2>&1 & PID=$!
sleep 1.5; timeout 30 node tools/loadtest/load.js $N; kill $PID; sleep .5; grep LAG /tmp/eldoria-bench.log | tail -2
