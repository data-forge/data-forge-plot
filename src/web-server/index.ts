import * as express from "express";
import * as path from "path";

/**
 * Web-server component. Serves the chart interative chart.
 */
export interface IWebServer {

    /**
     * The data that defines the chart.
     * Passed to the browser-based chart via REST API.
     */
    chartDef: any;

    /**
     * Start the web-server.
     */
    /*async*/ start (): Promise<void>;

    /**
     * Stop the web-server.
     */
    /*async*/ stop (): Promise<void>;
}

/**
 * Web-server component. Serves the chart interative chart.
 */
export class WebServer implements IWebServer {

    /**
     * The Express server instance that implements the web-server.
     */
    server: any | null = null;

    /**
     * The data that defines the chart.
     * Passed to the browser-based chart via REST API.
     */
    chartDef: any = {};

    /**
     * Start the web-server.
     */
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

    /**
     * Stop the web-server.
     */
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