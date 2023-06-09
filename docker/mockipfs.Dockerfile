FROM node:18

RUN <<EOF
#!/bin/bash

set -euxo pipefail

mkdir -p /usr/src/app
cd /usr/src/app
npm init -y
npm install --save-dev mockipfs
EOF

COPY <<EOF /usr/src/app/index.mjs
import * as MockIPFS from 'mockipfs';

const adminServer = MockIPFS.getAdminServer();
const PORT = parseInt(process.env.PORT || "80");

adminServer.start({ port: PORT, host: "0.0.0.0" }).then(() => {
    const stop = () => {
        console.log("stopping server")
        adminServer.stop();
    }
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    // Not using string literals due to dockerfile annoyance
    console.log("Admin server started at 0.0.0.0:" + PORT);
});
EOF

WORKDIR /usr/src/app

CMD [ "node", "index.mjs" ]