import * as express from "express";
import * as http from 'http';
import * as path from "path";
import { findPackageDir } from "./find-package-dir";

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
     * Get the URL to access the web-sever.
     */
    getUrl (): string;

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
     * The requested port number for the web server.
     */
    requestedPortNo: number;

    /**
     * The assigned port number for the web server.
     */
    assignedPortNo: number;

    /**
     * The Express server instance that implements the web-server.
     */
    server: any | null = null;

    /**
     * The data that defines the chart.
     * Passed to the browser-based chart via REST API.
     */
    chartDef: any = {};

    constructor (portNo: number) {
        this.requestedPortNo = portNo;
        this.assignedPortNo = portNo;
    }

    /**
     * Get the URL to access the web-sever.
     */
    getUrl (): string {
        return "http://127.0.0.1:" + this.assignedPortNo;
    }



    /**
     * Start the web-server.
     */
    start (): Promise<void> {
        return findPackageDir(__dirname)
            .then(parentDir => {
                return new Promise<void>((resolve, reject) => {
                    const app = express();
                    this.server = http.createServer(app);
            
                    const staticFilesPath = path.join(parentDir, "templates/image");
                    const staticFilesMiddleWare = express.static(staticFilesPath);
                    app.use("/", staticFilesMiddleWare);
            
                    app.get("/chart-data", (request, response) => {
                        response.json({
                            chartDef: this.chartDef,
                        });
                    });
                    
                    this.server.listen(this.requestedPortNo, (err: any) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.assignedPortNo = this.server.address().port
                            resolve();
                        }
                    });
                });
            });
    }

    /**
     * Stop the web-server.
     */
    /*async*/ stop (): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close((err: any) => {
                this.server = null;

                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

if (require.main === module) {
    // For command line testing.
    new WebServer(3000)
        .start()
        .then(() => {
            console.log("Server started;")
        })
        .catch(err => {
            console.error("Error starting web server.");
            console.error(err && err.stack || err);
        });
}