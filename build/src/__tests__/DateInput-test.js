"use strict";
var _this = this;
var React = require("react");
var DateInput_1 = require("../DateInput");
var react_addons_test_utils_1 = require("react-addons-test-utils");
describe("DateInput", function () {
    var onKeyDown = function () { return console.log("onKeyDown"); };
    var onSelect = function () { return console.log("onSelect"); };
    var onChange = function () { return console.log("onChange"); };
    var dateFormat = "MM/DD/YYYY";
    var event = new Event("Test");
    var renderer;
    var getDateInstance = function () {
        return (React.createElement(DateInput_1.DateInput, {selectedDateSection: DateInput_1.FormattedDateSections.MONTH_SECTION, onChange: onChange, onKeyDown: onKeyDown, onSelect: onSelect, value: dateFormat, dateFormate: DateInput_1.DateFormats.MMDDYYYY}));
    };
    it("render a component", function () {
        renderer = react_addons_test_utils_1.createRenderer();
        renderer.render(getDateInstance());
        var dateInput = renderer.getRenderOutput();
        expect(dateInput).toEqualJSX(React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "input-group"}, React.createElement("input", {ref: function (ref) { return _this.el = ref; }, type: "text", className: "form-control", value: dateFormat, onChange: onChange, onKeyDown: onKeyDown, onSelect: onSelect}))));
    });
    describe(".onSelection format MM/DD/YYYY", function () {
        var dateComponent;
        beforeEach(function () {
            dateComponent = react_addons_test_utils_1.renderIntoDocument(React.createElement(DateInput_1.DateInputComponent, null));
        });
        it("selects month", function () {
            dateComponent.onSelect(1, 1);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var monthSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION];
            expect(selectedSection).toEqual(monthSection);
        });
        it("selects date", function () {
            dateComponent.onSelect(3, 3);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var monthSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.DATE_SECTION];
            expect(selectedSection).toEqual(monthSection);
        });
        it("selects year", function () {
            dateComponent.onSelect(6, 6);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var yearSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION];
            expect(selectedSection).toEqual(yearSection);
        });
    });
    describe(".onSelection format DD/MM/YYYY", function () {
        var dateComponent;
        beforeEach(function () {
            dateComponent = react_addons_test_utils_1.renderIntoDocument(React.createElement(DateInput_1.DateInputComponent, {dateFormat: DateInput_1.DateFormats.DDMMYYYY}));
        });
        it("selects month", function () {
            dateComponent.onSelect(1, 1);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var dateSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.DATE_SECTION];
            expect(selectedSection).toEqual(dateSection);
        });
        it("selects date", function () {
            dateComponent.onSelect(3, 3);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var monthSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION];
            expect(selectedSection).toEqual(monthSection);
        });
        it("selects year", function () {
            dateComponent.onSelect(6, 6);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var yearSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION];
            expect(selectedSection).toEqual(yearSection);
        });
    });
    describe(".onKeydown format MM/DD/YYYY", function () {
        var dateComponent;
        beforeEach(function () {
            dateComponent = react_addons_test_utils_1.renderIntoDocument(React.createElement(DateInput_1.DateInputComponent, null));
        });
        it("ArrowRight", function () {
            dateComponent.onKeydown(DateInput_1.ArrowRight, event);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var dateSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.DATE_SECTION];
            expect(selectedSection).toEqual(dateSection);
        });
        it("ArrowLeft", function () {
            dateComponent.onKeydown(DateInput_1.ArrowLeft, event);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var dateSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION];
            expect(selectedSection).toEqual(dateSection);
        });
        it("Arrow Down increases the number initialized", function () {
            dateComponent.onChange('0'.charCodeAt(0), event);
            dateComponent.onKeydown(DateInput_1.ArrowDown, event);
            console.log("date component", dateComponent.state);
            var date = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION]];
            expect(date.value).toEqual('1');
        });
        it("Arrow Up decreases the number", function () {
            dateComponent.onChange('1'.charCodeAt(0), event);
            dateComponent.onKeydown(DateInput_1.ArrowUp, event);
            console.log("date component", dateComponent.state);
            var date = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION]];
            expect(date.value).toEqual('0');
        });
        it("Tab", function () {
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Tab, event);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var yearSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION];
            expect(selectedSection).toEqual(yearSection);
        });
        it("resets if the value is not reset on First Backspace", function () {
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onChange('1'.charCodeAt(0), event);
            dateComponent.onChange('9'.charCodeAt(0), event);
            dateComponent.onChange('9'.charCodeAt(0), event);
            dateComponent.onChange('8'.charCodeAt(0), event);
            var year = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION]];
            expect(year.value).toEqual("1998");
            dateComponent.onKeydown(DateInput_1.Backspace, event);
            year = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION]];
            expect(year.value).toEqual("");
        });
        it("switches to new selection region on Backspace", function () {
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Backspace, event);
            var selectedSection = DateInput_1.FormattedDateSections[dateComponent.state.selectedDateSection];
            var monthSection = DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION];
            expect(selectedSection).toEqual(monthSection);
        });
        it("on Tab when selection is in last date section", function () {
            spyOn(event, 'preventDefault').and.callThrough();
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Tab, event);
            expect(event.preventDefault).toHaveBeenCalledTimes(2);
        });
    });
    describe(".onChange MM/DD/YYYY", function () {
        var dateComponent;
        beforeEach(function () {
            dateComponent = react_addons_test_utils_1.renderIntoDocument(React.createElement(DateInput_1.DateInputComponent, null));
        });
        it("year input", function () {
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onKeydown(DateInput_1.Tab, event);
            dateComponent.onChange('1'.charCodeAt(0), event);
            dateComponent.onChange('9'.charCodeAt(0), event);
            dateComponent.onChange('9'.charCodeAt(0), event);
            dateComponent.onChange('8'.charCodeAt(0), event);
            var year = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.YEAR_SECTION]];
            expect(year.value).toEqual("1998");
        });
        it("date input", function () {
            dateComponent.onKeydown(DateInput_1.ArrowRight, event);
            dateComponent.onChange('1'.charCodeAt(0), event);
            dateComponent.onChange('2'.charCodeAt(0), event);
            var date = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.DATE_SECTION]];
            expect(date.value).toEqual("12");
        });
        it("month input", function () {
            dateComponent.onChange('1'.charCodeAt(0), event);
            dateComponent.onChange('2'.charCodeAt(0), event);
            var month = dateComponent.state.values[DateInput_1.FormattedDateSections[DateInput_1.FormattedDateSections.MONTH_SECTION]];
            expect(month.value).toEqual("12");
            expect(dateComponent.state.selectedDateSection).toEqual(DateInput_1.FormattedDateSections.DATE_SECTION);
            dateComponent.onKeydown(DateInput_1.ArrowLeft, event);
            expect(month.remainingInput).toEqual(month.defaultLength);
            dateComponent.onChange('1'.charCodeAt(0), event);
            expect(month.value).toEqual("1");
        });
    });
});
