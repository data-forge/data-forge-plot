const Nightmare = require("nightmare");
import { WebServer, IWebServer }  from "./web-server";
import { IPlotDef, IAxisMap } from ".";

declare const document: any;

export interface IChartRenderer {

    start (): void;
    /*async*/ end (): Promise<void>;
    /*async*/ renderImage (data: any[], plotDef: IPlotDef, axisMap: IAxisMap, outputFilePath: string): Promise<void>;

}

export class ChartRenderer implements IChartRenderer {

    nightmare: any | null = null;
    webServerPortNo: number = 3000; //todo: choose from available ports.
    webServer: IWebServer | null = null;

    async start (): Promise<void> {
        this.webServer = new WebServer();
        await this.webServer.start();

        this.nightmare = new Nightmare({
            show: false
        });

        this.nightmare.on('crashed', (evt: any) => {
            throw new Error("Nightmare crashed " + evt.toString());
        });

        this.nightmare.on('console', (type: string, message: string) => {

            if (type === 'log') {
                console.log('LOG: ' + message);
                return; // Don't bother with logs.
            }
    
            if (type === 'warn') {
                console.warn('LOG: ' + message);
                return;
            }
    
            if (type === 'error') {
                console.error("Browser JavaScript error:");
                console.error(message);
            }
        });
    }

    async end (): Promise<void> {

        await this.nightmare!.end();
        this.nightmare = null;

        await this.webServer!.stop();
        this.webServer = null;
    }

    async renderImage (data: any[], plotDef: IPlotDef, axisMap: IAxisMap, outputFilePath: string): Promise<void> {
        const selector = "svg";
        const url = "http://127.0.0.1:" + this.webServerPortNo;

        this.webServer!.chartDef = {
            data: data,
            plotDef: plotDef, //todo: this might prevent charts from being rendered in parallel!
            axisMap: axisMap,
        },

        this.nightmare!.goto(url); 
        
        await this.nightmare!.wait(selector)
            .evaluate(
                (selector: string) => {
                    const body = document.querySelector('body');
                    const element = document.querySelector(selector);
                    const rect = element.getBoundingClientRect();
                    return {
                        bodyWidth: body.scrollWidth,
                        bodyHeight: body.scrollHeight,
                        x: rect.left,
                        y: rect.top,
                        height: rect.bottom - rect.top,
                        width: rect.right - rect.left,
                    };
                }, 
                selector
            )
            .then((rect: any) => {
                return this.nightmare!
                    .viewport(rect.bodyWidth, rect.bodyHeight)
                    .screenshot(outputFilePath, rect);
            });
    }
}