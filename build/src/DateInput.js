"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
exports.ArrowDown = "ArrowDown";
exports.ArrowLeft = "ArrowLeft";
exports.ArrowUp = "ArrowUp";
exports.ArrowRight = "ArrowRight";
exports.Backspace = "Backspace";
exports.Tab = "Tab";
(function (DateFormats) {
    DateFormats[DateFormats["MMDDYYYY"] = 0] = "MMDDYYYY";
    DateFormats[DateFormats["DDMMYYYY"] = 1] = "DDMMYYYY";
    DateFormats[DateFormats["YYYMMDD"] = 2] = "YYYMMDD";
})(exports.DateFormats || (exports.DateFormats = {}));
var DateFormats = exports.DateFormats;
var MMDDYYFormate = {
    MONTH_SECTION: { start: 0, end: 2 },
    DATE_SECTION: { start: 3, end: 5 },
    YEAR_SECTION: { start: 6, end: 10 }
};
var DDMMYYFormate = {
    DATE_SECTION: { start: 0, end: 2 },
    MONTH_SECTION: { start: 3, end: 5 },
    YEAR_SECTION: { start: 6, end: 10 }
};
function nextDateSection(currentSection, format) {
    if (!format) {
        format = DateFormats.MMDDYYYY;
    }
    if (format === DateFormats.DDMMYYYY) {
        if (currentSection == FormattedDateSections.DATE_SECTION) {
            return FormattedDateSections.MONTH_SECTION;
        }
        else if (currentSection == FormattedDateSections.MONTH_SECTION) {
            return FormattedDateSections.YEAR_SECTION;
        }
        else {
            return currentSection;
        }
    }
    else if (format === DateFormats.MMDDYYYY) {
        if (currentSection == FormattedDateSections.MONTH_SECTION) {
            return FormattedDateSections.DATE_SECTION;
        }
        else if (currentSection == FormattedDateSections.DATE_SECTION) {
            return FormattedDateSections.YEAR_SECTION;
        }
        else {
            return currentSection;
        }
    }
}
function previousDateSection(currentSection, format) {
    if (!format) {
        format = DateFormats.MMDDYYYY;
    }
    if (format === DateFormats.DDMMYYYY) {
        if (currentSection == FormattedDateSections.YEAR_SECTION) {
            return FormattedDateSections.MONTH_SECTION;
        }
        else if (currentSection == FormattedDateSections.MONTH_SECTION) {
            return FormattedDateSections.DATE_SECTION;
        }
        else {
            return currentSection;
        }
    }
    else if (format === DateFormats.MMDDYYYY) {
        if (currentSection == FormattedDateSections.YEAR_SECTION) {
            return FormattedDateSections.DATE_SECTION;
        }
        else if (currentSection == FormattedDateSections.DATE_SECTION) {
            return FormattedDateSections.MONTH_SECTION;
        }
        else {
            return currentSection;
        }
    }
}
var DateSection = (function () {
    function DateSection(defaultFmt, defaultLength, name) {
        this.name = name;
        this.defaultFmt = defaultFmt;
        this.defaultLength = defaultLength;
        this.value = "";
        this.remainingInput = defaultLength;
    }
    DateSection.prototype.reset = function () {
        this.value = "";
        this.remainingInput = this.defaultLength;
    };
    return DateSection;
}());
exports.DateSection = DateSection;
(function (FormattedDateSections) {
    FormattedDateSections[FormattedDateSections["MONTH_SECTION"] = 0] = "MONTH_SECTION";
    FormattedDateSections[FormattedDateSections["DATE_SECTION"] = 1] = "DATE_SECTION";
    FormattedDateSections[FormattedDateSections["YEAR_SECTION"] = 2] = "YEAR_SECTION";
})(exports.FormattedDateSections || (exports.FormattedDateSections = {}));
var FormattedDateSections = exports.FormattedDateSections;
;
var DateInputComponent = (function (_super) {
    __extends(DateInputComponent, _super);
    function DateInputComponent(props) {
        _super.call(this, props);
        this.state = {
            selectedDateSection: FormattedDateSections.MONTH_SECTION,
            values: {
                DATE_SECTION: new DateSection("DD", 2, "date"),
                MONTH_SECTION: new DateSection("MM", 2, "month"),
                YEAR_SECTION: new DateSection("YYYY", 4, "year"),
            }
        };
    }
    DateInputComponent.prototype.formattedDate = function (fmtMonth, fmtDay, fmtYear) {
        if (this.props.dateFormat && this.props.dateFormat == DateFormats.DDMMYYYY) {
            return fmtDay + "/" + fmtMonth + "/" + fmtYear;
        }
        else {
            return fmtMonth + "/" + fmtDay + "/" + fmtYear;
        }
    };
    DateInputComponent.prototype.selectedFormat = function () {
        if (this.props.dateFormat && this.props.dateFormat == DateFormats.DDMMYYYY) {
            return DDMMYYFormate;
        }
        else {
            return MMDDYYFormate;
        }
    };
    DateInputComponent.prototype.dateValue = function () {
        var date = this.state.values.DATE_SECTION;
        var month = this.state.values.MONTH_SECTION;
        var year = this.state.values.YEAR_SECTION;
        var fmtDay = !!date.value ? this.stringPadding(date.defaultLength, date.value) : date.defaultFmt;
        var fmtMonth = !!month.value ? this.stringPadding(month.defaultLength, month.value) : month.defaultFmt;
        var fmtYear = !!year.value ? this.stringPadding(year.defaultLength, year.value) : year.defaultFmt;
        return this.formattedDate(fmtMonth, fmtDay, fmtYear);
    };
    DateInputComponent.prototype.setNewSelectionRange = function (section) {
        var selectedSection = this.state.values[FormattedDateSections[section]];
        selectedSection.remainingInput = selectedSection.defaultLength;
        this.state.values[FormattedDateSections[section]] = selectedSection;
        this.state.selectedDateSection = section;
        this.setState(this.state);
    };
    DateInputComponent.prototype.onSelect = function (start, end) {
        var selectedSelection;
        var format = this.selectedFormat();
        for (var dateSection in format) {
            if (format.hasOwnProperty(dateSection)) {
                if (start >= format[dateSection].start && start <= format[dateSection].end) {
                    selectedSelection = FormattedDateSections[dateSection];
                }
            }
        }
        this.setNewSelectionRange(selectedSelection);
    };
    DateInputComponent.prototype.callOnChangeCallback = function () {
        if (this.props.onChange) {
            var year = this.state.values.YEAR_SECTION.value;
            var month = this.state.values.MONTH_SECTION.value;
            var date = this.state.values.DATE_SECTION.value;
            this.props.onChange(year, month, date);
        }
    };
    DateInputComponent.prototype.onKeydown = function (key, e) {
        var nextSection;
        var selectedIndex = this.state.selectedDateSection;
        if (key == exports.ArrowRight) {
            nextSection = this.nextDateSection(selectedIndex);
        }
        else if (key == exports.ArrowLeft) {
            nextSection = this.previousDateSection(selectedIndex);
        }
        else if (key == exports.Tab) {
            nextSection = this.nextDateSection(selectedIndex);
            if (selectedIndex === nextSection) {
                return;
            }
        }
        else if (key == exports.Backspace) {
            var selectedValue = this.state.values[FormattedDateSections[selectedIndex]];
            if (selectedValue.value == "") {
                nextSection = this.previousDateSection(selectedIndex);
            }
            else {
                nextSection = selectedIndex;
                selectedValue.reset();
                this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
                this.setState(this.state);
            }
        }
        else if (key == exports.ArrowDown) {
            nextSection = selectedIndex;
            var selectedValue = this.state.values[FormattedDateSections[selectedIndex]];
            if (selectedValue.value != "" && parseInt(selectedValue.value) >= 0) {
                var newValue = parseInt(selectedValue.value) + 1;
                selectedValue.value = newValue.toString();
                this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
                this.setState(this.state);
            }
        }
        else if (key == exports.ArrowUp) {
            nextSection = selectedIndex;
            var selectedValue = this.state.values[FormattedDateSections[selectedIndex]];
            if (selectedValue.value != "" && parseInt(selectedValue.value) > 0) {
                var newValue = parseInt(selectedValue.value) - 1;
                selectedValue.value = newValue.toString();
                this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
                this.setState(this.state);
            }
        }
        e.preventDefault();
        this.setNewSelectionRange(nextSection);
        this.callOnChangeCallback();
    };
    DateInputComponent.prototype.onChange = function (keyChar, e) {
        e.preventDefault();
        var selectedDateSection = this.state.selectedDateSection;
        var section = this.state.values[FormattedDateSections[selectedDateSection]];
        if (section.remainingInput == section.defaultLength) {
            section.value = String.fromCharCode(keyChar);
            section.remainingInput -= 1;
        }
        else if (section.remainingInput > 0) {
            section.value += String.fromCharCode(keyChar);
            section.remainingInput -= 1;
        }
        this.state.values[FormattedDateSections[selectedDateSection]] = section;
        this.setState(this.state);
        if (section.remainingInput == 0) {
            selectedDateSection = this.nextDateSection(selectedDateSection);
            this.setNewSelectionRange(selectedDateSection);
        }
        this.callOnChangeCallback();
    };
    DateInputComponent.prototype.stringPadding = function (length, str) {
        var pad = "0000".substring(0, length);
        var ans = pad.substring(0, pad.length - str.length) + str;
        return ans;
    };
    DateInputComponent.prototype.nextDateSection = function (currentSection) {
        return nextDateSection(currentSection, this.props.dateFormat);
    };
    DateInputComponent.prototype.previousDateSection = function (currentSection) {
        return previousDateSection(currentSection, this.props.dateFormat);
    };
    DateInputComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement(DateInput, {dateFormate: this.props.dateFormat, onChange: function (key, e) {
            _this.onChange(key, e);
        }, onKeyDown: function (keyCode, e) {
            _this.onKeydown(keyCode, e);
        }, onSelect: function (start, end) { return _this.onSelect(start, end); }, value: this.dateValue(), selectedDateSection: this.state.selectedDateSection}));
    };
    return DateInputComponent;
}(React.Component));
exports.DateInputComponent = DateInputComponent;
var DateInput = (function (_super) {
    __extends(DateInput, _super);
    function DateInput() {
        _super.apply(this, arguments);
    }
    DateInput.prototype.getSelectedDateFormat = function () {
        if (this.props.dateFormate === DateFormats.DDMMYYYY) {
            return DDMMYYFormate;
        }
        else {
            return MMDDYYFormate;
        }
    };
    DateInput.prototype.componentDidUpdate = function () {
        var selectedSection = FormattedDateSections[this.props.selectedDateSection];
        var selectedFormate = this.getSelectedDateFormat();
        var _a = selectedFormate[selectedSection], start = _a.start, end = _a.end;
        this.el.setSelectionRange(start, end);
    };
    DateInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, onKeyDown = _a.onKeyDown, onSelect = _a.onSelect, onChange = _a.onChange;
        return (React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "input-group"}, React.createElement("input", {ref: (function (ref) { return _this.el = ref; }), type: "text", className: "form-control", value: this.props.value, onChange: function (e) { }, onKeyDown: function (e) {
            if (e.keyCode >= 48 && e.keyCode <= 57) {
                onChange(e.keyCode, e);
            }
            else {
                onKeyDown(e.key, e);
            }
        }, onSelect: function (e) {
            e.preventDefault();
            var _a = [_this.el.selectionStart, _this.el.selectionEnd], start = _a[0], end = _a[1];
            onSelect(start, end);
        }}))));
    };
    return DateInput;
}(React.Component));
exports.DateInput = DateInput;
