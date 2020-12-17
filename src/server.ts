import app from './app';
import http from 'http';
import debug from 'debug';

const debugLog: debug.IDebugger = debug('server');
const port: number = 3000;

const server: http.Server = http.createServer(app);

server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
});