import "jest";
jest.mock("capture-template");
jest.mock("inflate-template");
import { captureImage } from "capture-template";
import { exportTemplate } from "inflate-template";
import { PlotAPI } from "../plot-api";
import { ChartType, HorizontalLabelPosition, VerticalLabelPosition, AxisType } from "@data-forge-plot/chart-def";
import { IAxisMap, IPlotConfig } from "../chart-def";

describe("plot-api", () => {

    it("can set chart type from def", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { chartType: ChartType.Bubble };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        expect(plot.serialize().plotConfig.chartType).toBe(ChartType.Bubble);
    });

    it("can set chart type from fluent API", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        plot.chartType(ChartType.Bubble);
        expect(plot.serialize().plotConfig.chartType).toBe(ChartType.Bubble);
    });

    it("can override chart type from fluent API", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { chartType: ChartType.Pie };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        plot.chartType(ChartType.Radar);
        expect(plot.serialize().plotConfig.chartType).toBe(ChartType.Radar);
    });

    it("can set width and height from def", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { width: 333, height: 444 };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.width).toBe(333);
        expect(serialized.plotConfig.height).toBe(444);
    });

    it("can set width and height from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { width: 333, height: 444 };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .width(222)
            .height(555);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.width).toBe(222);
        expect(serialized.plotConfig.height).toBe(555);
    });

    it("can override width and height from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { width: 333, height: 444 };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .width(99)
            .height(88);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.width).toBe(99);
        expect(serialized.plotConfig.height).toBe(88);
    });

    it("can serialize and deserialize", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { width: 333, height: 444 };
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized1 = plot.serialize();
        const serialized2 = PlotAPI.deserialize(serialized1).serialize();
        expect(serialized1).toEqual(serialized2);
    });

    it("can configure x axis", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .x()
                .label("my label")
            .serialize();
        expect(serialized.plotConfig.x.label!.text).toBe("my label");
    });

    it("can configure y axis", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y()
                .label("my label")
            .serialize();
        expect(serialized.plotConfig.y.label!.text).toBe("my label");
    });

    it("can configure y2 axis", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y2()
                .label("my label")
            .serialize();
        expect(serialized.plotConfig.y2.label!.text).toBe("my label");
    });

    it("can set x axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .x()
                .setSeries("my series")
            .serialize();
        expect(serialized.axisMap.x!.series).toBe("my series");
    });

    it("can add y axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y()
                .addSeries("my series")
            .serialize();
        expect(serialized.axisMap.y[0].series).toBe("my series");
    });

    it("can add y2 axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y2()
                .addSeries("my series")
            .serialize();
        expect(serialized.axisMap.y2[0].series).toBe("my series");
    });

    /*todo:
        nothing to configure yet!
    it("can config x axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .x()
                .setSeries("my series")
                    .
            .serialize();
        expect(serialized.axisMap.x!.series).toBe("my series");
    });
    */

    it("can configure y axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y()
                .addSeries("my series")
                    .label("a great series")
            .serialize();
        expect(serialized.axisMap.y[0].label!).toBe("a great series");
    });

    it("can set specific x series for y axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y()
                .addSeries("my series")
                    .setX("my x")
            .serialize();
        expect(serialized.axisMap.y[0].x!.series).toBe("my x");
    });

    it("can configure y axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y2()
                .addSeries("my series")
                    .label("a great series")
            .serialize();
        expect(serialized.axisMap.y2[0].label!).toBe("a great series");
    });

    it("can set specific x series for y2 axis series", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y2()
                .addSeries("my series")
                    .setX("my x")
            .serialize();
        expect(serialized.axisMap.y2[0].x!.series).toBe("my x");
    });

    it("can set x axis label", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("A label!");
    });

    it("can set x axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("My label!");
    });

    it("can override x axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("My label!");
    });

    it("can set x axis label position", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { position: HorizontalLabelPosition.OuterRight }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.position).toBe(HorizontalLabelPosition.OuterRight);
    });

    it("can set x axis type", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .type(AxisType.Timeseries);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.axisType).toBe(AxisType.Timeseries);
    });

    it("can set x axis label", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("A label!");
    });

    it("can set x axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("My label!");
    });

    it("can override x axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.label!.text).toBe("My label!");
    });

    it("can set x axis label position", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .x()
                .labelPosition(HorizontalLabelPosition.OuterLeft)
            .serialize();
        expect(serialized.plotConfig.x!.label!.position).toBe(HorizontalLabelPosition.OuterLeft);
    });

    it("can set x axis type", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .x()
                .type(AxisType.Timeseries);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.x!.axisType).toBe(AxisType.Timeseries);
    });

    it("can set y axis label", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { y: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y!.label!.text).toBe("A label!");
    });

    it("can set y axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y!.label!.text).toBe("My label!");
    });

    it("can override y axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { y: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y!.label!.text).toBe("My label!");
    });

    it("can set y axis label position", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y()
                .labelPosition(VerticalLabelPosition.OuterMiddle)
            .serialize();
        expect(serialized.plotConfig.y!.label!.position).toBe(VerticalLabelPosition.OuterMiddle);
    });

    it("can set y axis type", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y()
                .type(AxisType.Timeseries);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y!.axisType).toBe(AxisType.Timeseries);
    });

    it("can set y2 axis label", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { y2: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y2!.label!.text).toBe("A label!");
    });

    it("can set y2 axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y2()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y2!.label!.text).toBe("My label!");
    });

    it("can override y2 axis label from fluent api", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { y2: { label: { text: "A label!" }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y2()
                .label("My label!");
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y2!.label!.text).toBe("My label!");
    });

    it("can set y2 axis label position", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const serialized = plot
            .y2()
                .labelPosition(VerticalLabelPosition.OuterMiddle)
            .serialize();
        expect(serialized.plotConfig.y2!.label!.position).toBe(VerticalLabelPosition.OuterMiddle);
    });

    it("can set y2 axis type", () => {
        const data: any = {};
        const plotConfig: IPlotConfig = {};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap)
            .y2()
                .type(AxisType.Timeseries);
        const serialized = plot.serialize();
        expect(serialized.plotConfig.y2!.axisType).toBe(AxisType.Timeseries);
    });

    it("can render image", async () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { position: HorizontalLabelPosition.OuterRight }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const outputPath = "./output/test";
        await plot.renderImage(outputPath);
        expect(captureImage).toHaveBeenCalled();
    });

    it("can export web", async () => {
        const data: any = {};
        const plotConfig: IPlotConfig = { x: { label: { position: HorizontalLabelPosition.OuterRight }}};
        const axisMap: IAxisMap = {};
        const plot = new PlotAPI(data, plotConfig, axisMap);
        const outputPath = "./output/test";
        await plot.exportWeb(outputPath);
        expect(exportTemplate).toHaveBeenCalled();
    });
});
