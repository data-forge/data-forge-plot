import { assert, expect } from 'chai';
import 'mocha';
import { Series } from 'data-forge';
import "../index";

describe('data-forge-plot', () => {

    it('plot test', ()  => {

        const series = new Series({ index: [1, 2, 3], values: [10, 20, 30] });
        const plotAPI = series.plot();
        plotAPI.renderImage("some-image.png");
    });

});
