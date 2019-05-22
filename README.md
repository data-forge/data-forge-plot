# data-forge-plot

The forgiving plotting API designed for use with [Data-Forge](https://github.com/data-forge/data-forge-ts).

Use Data-Forge Plot to quickly and conveniently render charts from your data in JavaScript or TypeScript. It is an abstraction layer that connects Data-Forge with JavaScript visualization libraries so that it's easy to plot charts from your data.

Why not do your data wrangling, analysis and visualization entirely in JavaScript? To support my effort please buy or help promote my book 
[Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

Or check out my blog: [The Data Wrangler](http://www.the-data-wrangler.com/).

Do your prototyping and exploratory data analysis in JavaScript with [Data-Forge Notebook](http://www.data-forge-notebook.com/).

Please join the conversation on [Gitter](https://gitter.im/data-forge)

## Breaking changes

As of version 0.4.0 the Nightmare/Electron depenency has been removed along with the `renderImage` function. 

The `renderImage` function has been moved to the separate library [@data-forge-plot/render](todo). This has been removed due to the size that the Electron dependency adds to this package. In the future you you will have to install the separate package to render a plot to an image.

Please note that the sample code below to see how the new library is installed and *required* to access the `renderImage` function.


## Project Goals

- To simply and conveniently from a series or dataframe to chart.
- To create charts and visualizations in Node.js and the browser.
- To export web-based interactive charts that can easily be hosted under a web-server.
- To be able to serialize a chart to JSON and then reinstantiate it from the JSON in a web-app.
- To separate configuration and data definition to make it easy to reuse charts.
- To configure charts in JSON or fluent API.

## Usage

Some instructions for using Data-Forge Plot. These instructions are for JavaScript, but this library also works in TypeScript.

### Install

    npm install --save data-forge data-forge-plot @data-forge-plot/render

### Setup

```javascript
    const dataForge = require('data-forge');
    require('data-forge-fs'); // Extends Data-Forge with 'readFile' function.
    require('data-forge-plot'); // Extends Data-Forge with the 'plot' function.
    require('@data-forge-plot/render'); // Extends Data-Forge Plot with the 'renderImage' function.
```

### Rendering a chart from a CSV file to an image file

```javascript
    const dataFrame = await dataForge.readFile("my-data-file.csv").parseCSV();
    await dataFrame.plot().renderImage("my-chart.png");
```

### Exporting a chart from a CSV file to an interactive web visualization

```javascript
    const dataFrame = await dataForge.readFile("my-data-file.csv").parseCSV();
    await dataFrame.plot().exportWeb("./output-path");
```

### More docs coming soon

It's early days for DFP. I'll be working on more docs soon.

To see examples of API usage please see my blog posts:
- http://www.the-data-wrangler.com/introducing-data-forge-plot/
- http://www.the-data-wrangler.com/data-forge-plot-update/
- http://www.the-data-wrangler.com/data-forge-plot-update2/

There's also a first example of DFP here (JavaScript):

https://github.com/data-forge/data-forge-plot-first-example

There's a bunch of TypeScript examples in DFP's GitHub repo:

https://github.com/data-forge/data-forge-plot/tree/master/examples/
