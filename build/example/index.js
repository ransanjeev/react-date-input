"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var DateInput_1 = require("../src/DateInput");
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(props) {
        _super.call(this, props);
        this.state = {
            year: "",
            month: "",
            date: ""
        };
    }
    Container.prototype.onChange = function (year, month, date) {
        this.setState({ year: year, month: month, date: date });
    };
    Container.prototype.render = function () {
        var _a = this.state, year = _a.year, month = _a.month, date = _a.date;
        if (!!!year) {
            year = "YYYY";
        }
        ;
        if (!!!month) {
            month = "MM";
        }
        ;
        if (!!!date) {
            date = "DD";
        }
        ;
        return (React.createElement("div", null, React.createElement("div", null, React.createElement("h3", null, "Component"), React.createElement(DateInput_1.DateInputComponent, {onChange: this.onChange.bind(this), dateFormat: DateInput_1.DateFormats.DDMMYYYY})), React.createElement("div", {className: "date-preview"}, React.createElement("h3", null, "Date Preview"), React.createElement("p", null, date + "/" + month + "/" + year))));
    };
    return Container;
}(React.Component));
ReactDOM.render(React.createElement(Container, null), document.getElementById('root'));
