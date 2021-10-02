# data-forge-plot

The forgiving plotting API designed for use with [Data-Forge](https://github.com/data-forge/data-forge-ts).

Data-Forge Plot is now a simple wrapper for [the Plot library](https://www.npmjs.com/package/plot).

Use Data-Forge Plot to quickly and conveniently render charts from your data in JavaScript or TypeScript. It is an abstraction layer that connects Data-Forge with JavaScript visualization libraries so that it's easy to plot charts from your data.

Why not do your data wrangling, analysis and visualization entirely in JavaScript? To support my effort please buy or help promote my book 
[Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

Or check out my blog: [The Data Wrangler](http://www.the-data-wrangler.com/).

Do your prototyping and exploratory data analysis in JavaScript with [Data-Forge Notebook](http://www.data-forge-notebook.com/).

Please join the conversation on [Gitter](https://gitter.im/data-forge)

[Click here to support my work](https://www.codecapers.com.au/about#support-my-work)

## Breaking changes

As of version 1.0.0 Data-Forge Plot has been gutted and reimplimented in terms of the [Plot library](https://www.npmjs.com/package/plot) (which is very similar). DFP is now just a wrapper for Plot to ease my maintence burden.

The function `exportWeb` has been removed because it is to difficult to maintain.

If you want to use this in the browser please use the [Plot library](https://www.npmjs.com/package/plot) instead, e.g.:

```javascript
const dataframe = ...
const plotConfig = { ... };
const axisMap = { ... };
import { plot } from "plot";
import "@plotex/render-dom";
plot(dataframe.toArray(), plotConfig, axisMap)
    .renderDOM(document.getElementByID("a-chart");
```

--

As of version 0.4.0 the Nightmare/Electron depenency has been removed along with the `renderImage` function. 

The `renderImage` function has been moved to the separate library [@data-forge-plot/render](todo). This has been removed due to the size that the Electron dependency adds to this package. In the future you you will have to install the separate package to render a plot to an image.

Please note that the sample code below to see how the new library is installed and *required* to access the `renderImage` function.


## Project Goals

- To simply and conveniently from a series or dataframe to chart.
- To create charts and visualizations in Node.js and the browser.
- To be able to serialize a chart to JSON and then reinstantiate it from the JSON in a web-app.
- To separate configuration and data definition to make it easy to reuse charts.
- To configure charts in JSON or fluent API.

## Usage

Some instructions for using Data-Forge Plot. These instructions are for JavaScript, but this library also works in TypeScript.

### Install

    npm install --save data-forge data-forge-plot @plotex/render-image

### Setup

```javascript
    const dataForge = require('data-forge');
    require('data-forge-fs'); // Extends Data-Forge with 'readFile' function.
    require('data-forge-plot'); // Extends Data-Forge with the 'plot' function.
    require('@plotex/render-image'); // Extends Data-Forge Plot with the 'renderImage' function.
    require('@plotex/render-dom'); // Extends Data-Forge Plot with the 'renderDOM' function.
```

### Rendering a chart from a CSV file to an image file

```javascript
    const dataFrame = await dataForge.readFile("my-data-file.csv").parseCSV();
    await dataFrame.plot().renderImage("my-chart.png");
```

### Rendering a chart to a web page.

```javascript
    const dataArray = // ... acquire data, e.g. from a REST API ...
    const dataFrame = new DataFrame(dataArray);
    const chartElement = document.getElementById("chart");
    await dataFrame.plot().renderDOM(chartElement);
```
