"use strict";
exports.__esModule = true;
/**
 * Defines the type of chart to output.
 */
var ChartType;
(function (ChartType) {
    ChartType["Line"] = "line";
    ChartType["Bar"] = "bar";
    ChartType["Scatter"] = "scatter";
})(ChartType = exports.ChartType || (exports.ChartType = {}));
/**
 * Defines the type of an axis.
 */
var AxisType;
(function (AxisType) {
    AxisType["Indexed"] = "indexed";
    AxisType["Timeseries"] = "timeseries";
    AxisType["Category"] = "category";
})(AxisType = exports.AxisType || (exports.AxisType = {}));
/**
 * Defines the position of a horizontal label.
 */
var HorizontalLabelPosition;
(function (HorizontalLabelPosition) {
    HorizontalLabelPosition["InnerRight"] = "inner-right";
    HorizontalLabelPosition["InnerCenter"] = "inner-center";
    HorizontalLabelPosition["InnerLeft"] = "inner-left";
    HorizontalLabelPosition["OuterRight"] = "outer-right";
    HorizontalLabelPosition["OuterCenter"] = "outer-center";
    HorizontalLabelPosition["OuterLeft"] = "outer-left";
})(HorizontalLabelPosition = exports.HorizontalLabelPosition || (exports.HorizontalLabelPosition = {}));
/**
 * Defines the position of a vertical label.
 */
var VerticalLabelPosition;
(function (VerticalLabelPosition) {
    VerticalLabelPosition["InnerTop"] = "inner-top";
    VerticalLabelPosition["InnerMiddle"] = "inner-middle";
    VerticalLabelPosition["InnerBottom"] = "inner-bottom";
    VerticalLabelPosition["OuterTop"] = "outer-top";
    VerticalLabelPosition["OuterMiddle"] = "outer-middle";
    VerticalLabelPosition["OuterBottom"] = "outer-bottom";
})(VerticalLabelPosition = exports.VerticalLabelPosition || (exports.VerticalLabelPosition = {}));
