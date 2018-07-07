const Nightmare = require("nightmare");
import { WebServer, IWebServer }  from "./web-server";
import { IChartDef } from "./chart-def";

declare const document: any;

/**
 * Interface to the chart renderer.
 * This component is responsible for turning data and a chart definition into a chart.
 */
export interface IChartRenderer {

    /**
     * Start the chart renderer.
     * For performance reasons the chart render can be reused to render multiple charts.
     */
    start (chartTemplatesPath: string, showBrowser: boolean): void;

    /**
     * Finish the chart renderer.
     */
    /*async*/ end (): Promise<void>;

    /**
     * Create a chart from data and a chart definition and render it to an image file.
     */
    /*async*/ renderImage (chartDef: IChartDef, outputFilePath: string, chartRootSelector: string): Promise<void>;
}

/**
 * This component is responsible for turning data and a chart definition into a chart.
 */
export class ChartRenderer implements IChartRenderer {

    /**
     * Nightmare headless browser instance.
     */
    nightmare: any | null = null;

    /**
     * Interface to the web-server that serves the interactive chart.
     */
    webServer: IWebServer | null = null;

    /**
     * Start the chart renderer.
     * For performance reasons the chart render can be reused to render multiple charts.
     */
    async start (chartTemplatesPath: string, showBrowser: boolean): Promise<void> {
        const autoAssignPortNo = 0; // Use port no 0, to automatically assign a port number.
        this.webServer = new WebServer(autoAssignPortNo);
        await this.webServer.start(chartTemplatesPath);

        this.nightmare = new Nightmare({
            show: false,
            frame: false,
        });

        this.nightmare.on('crashed', (evt: any) => {
            throw new Error("Nightmare crashed " + evt.toString());
        });

        this.nightmare.on('console', (type: string, message: string) => {

            if (type === 'log') {
                console.log('LOG: ' + message);
                return;
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

    /**
     * Finish the chart renderer.
     */
    async end (): Promise<void> {

        await this.nightmare!.end();
        this.nightmare = null;

        await this.webServer!.stop();
        this.webServer = null;
    }

    /**
     * Load the chart into the Electron browser.
     */
    async loadChart (chartDef: IChartDef, chartRootSelector: string): Promise<void> {

        this.webServer!.chartDef = chartDef; //todo: this might prevent charts from being rendered in parallel!

        const chartTemplateUrl = this.webServer!.getUrl() + "/" + chartDef.plotConfig.template + "/image/index.html";
        this.nightmare.goto(chartTemplateUrl); 
        await this.nightmare.wait(chartRootSelector);
    }

    /**
     * Create a chart from data and a chart definition and render it to an image file.
     */
    async renderImage (chartDef: IChartDef, outputFilePath: string, chartRootSelector: string): Promise<void> { //todo: need to pass in the selector we are waiting for!!
        await this.loadChart(chartDef, chartRootSelector);

        await this.nightmare.evaluate(
                (chartRootSelector: string) => {
                    const body = document.querySelector('body');
                    const element = document.querySelector(chartRootSelector);
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
                chartRootSelector
            )
            .then((rect: any) => {
                return this.nightmare
                    .viewport(rect.bodyWidth, rect.bodyHeight)
                    .screenshot(outputFilePath, rect);
            });
    }
}