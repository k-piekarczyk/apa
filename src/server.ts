import { initializeApp } from "./app";
import * as http from "http";
import debug from "debug";
import { env } from "process"

async function main(): Promise<void> {
    const debugLog: debug.IDebugger = debug("server");
    const port: number = Number.parseInt(env.PORT || "3000");

    const server: http.Server = http.createServer(await initializeApp());

    server.listen(port, () => {
        debugLog(`Server running at http://localhost:${port}`);
    });
}
main();
