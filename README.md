# data-forge-plot

The forgiving plotting API designed for use with [Data-Forge](https://github.com/data-forge/data-forge-ts).

Use Data-Forge Plot to quickly and conveniently render charts from your data in JavaScript or TypeScript. It is an interface to other JS charting libraries such as C3.

Why not do your data wrangling, analysis and visualization entirely in JavaScript? To support my effort please buy or help promote my book 
[Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

Or check out my blog: [The Data Wrangler](http://www.the-data-wrangler.com/).

Do your prototyping and exploratory data analysis in JavaScript with [Data-Forge Notebook](http://www.data-forge-notebook.com/).

THIS JS LIBRARY IS A WORK IN PROGRESS

If you want to understand and give feedback on this new API, [please first read my introductory blog post](http://www.the-data-wrangler.com/introducing-data-forge-plot/).

Please join the conversation on [Gitter](https://gitter.im/data-forge)

## Project Goals

- To go as simple and conveniently as possible from a series or dataframe to chart.
- To be able to output charts and visualizations directly from Node.js to image files.
- To be able to export an web-based interactive chart from Node.js that could easily be hosted under a web-server.
- To integrate with a Juptyr Notebook style application for Node.js / JavaScript.
- To be able to serialize a chart to JSON and then reinstantiate it from the JSON in a web-app.
- To separate chart definition and data definition so that chart definitions can easily be reused with different data sets.
- To configure charts either via JSON or via the fluent API, ultimately though it should be able to be expressed in JSON but with fluent API as syntactic sugar.

## Usage

Some instructions for using Data-Forge Plot. These instructions are for JavaScript but this library also works in TypeScript.

### Install

    npm install --save data-forge data-forge-plot

### Setup

```javascript
    const dataForge = require('data-forge');
    require('data-forge-plot'); // Extends Data-Forge with the 'plot' function.
```

### Rendering a chart from a CSV file

```javascript
    const dataFrame = await dataForge.readFile("my-data-file.csv").parseCSV();
    await dataFrame.plot().renderImage("my-chart.png");
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

https://github.com/data-forge/data-forge-plot/tree/master/examples/c3
