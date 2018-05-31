import * as express from "express";
import * as path from "path";

export interface IWebServer {

    chartDef: any;

    /*async*/ start (): Promise<void>;
    /*async*/ stop (): Promise<void>;
}

export class WebServer implements IWebServer {

    server: any | null = null;
    chartDef: any = {};

    start (): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express();
    
            const staticFilesPath = path.join(__dirname, "template");
            const staticFilesMiddleWare = express.static(staticFilesPath);
            app.use("/", staticFilesMiddleWare);
    
            app.get("/chart-data", (request, response) => {
                response.json({
                    chartDef: this.chartDef,
                });
            });
            
            this.server = app.listen(3000, (err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    async stop (): Promise<void> {
        await this.server.close();
        this.server = null;
    }
}

if (require.main === module) {
    // For command line testing.
    new WebServer()
        .start()
        .then(() => {
            console.log("Server started;")
        })
        .catch(err => {
            console.error("Error starting web server.");
            console.error(err && err.stack || err);
        })
}