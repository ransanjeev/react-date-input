import React = require("react");

export const ArrowDown = "ArrowDown";
export const ArrowLeft = "ArrowLeft";
export const ArrowUp = "ArrowUp";
export const ArrowRight = "ArrowRight";
export const Backspace = "Backspace";
export const Tab = "Tab";

export enum DateFormats {
  MMDDYYYY,
  DDMMYYYY,
  YYYMMDD
}

const MMDDYYFormate = {
  MONTH_SECTION: { start: 0, end: 2 },
  DATE_SECTION: { start: 3, end: 5 },
  YEAR_SECTION: { start: 6, end: 10 }
}

const DDMMYYFormate = {
  DATE_SECTION: { start: 0, end: 2 },
  MONTH_SECTION: { start: 3, end: 5 },
  YEAR_SECTION: { start: 6, end: 10 }
}

function nextDateSection(currentSection: FormattedDateSections, format: DateFormats) {
  if(!format){
    format = DateFormats.MMDDYYYY;
  }
  if (format === DateFormats.DDMMYYYY) {
    if (currentSection == FormattedDateSections.DATE_SECTION) {
      return FormattedDateSections.MONTH_SECTION;
    } else if (currentSection == FormattedDateSections.MONTH_SECTION) {
      return FormattedDateSections.YEAR_SECTION;
    } else {
      return currentSection;
    }
  } else if (format === DateFormats.MMDDYYYY) {
    if (currentSection == FormattedDateSections.MONTH_SECTION) {
      return FormattedDateSections.DATE_SECTION;
    } else if (currentSection == FormattedDateSections.DATE_SECTION) {
      return FormattedDateSections.YEAR_SECTION;
    } else {
      return currentSection;
    }
  }
}

function previousDateSection(currentSection: FormattedDateSections, format: DateFormats ) {
  if(!format){
    format = DateFormats.MMDDYYYY;
  }
  if (format === DateFormats.DDMMYYYY) {
    if (currentSection == FormattedDateSections.YEAR_SECTION) {
      return FormattedDateSections.MONTH_SECTION;
    } else if (currentSection == FormattedDateSections.MONTH_SECTION) {
      return FormattedDateSections.DATE_SECTION;
    } else {
      return currentSection;
    }
  } else if (format === DateFormats.MMDDYYYY) {
    if (currentSection == FormattedDateSections.YEAR_SECTION) {
      return FormattedDateSections.DATE_SECTION;
    } else if (currentSection == FormattedDateSections.DATE_SECTION) {
      return FormattedDateSections.MONTH_SECTION;
    } else {
      return currentSection;
    }
  }
}

export class DateSection {
  value: string;
  remainingInput: number;
  name: string;
  defaultFmt: string;
  defaultLength: number;
  constructor(defaultFmt, defaultLength, name) {
    this.name = name;
    this.defaultFmt = defaultFmt;
    this.defaultLength = defaultLength;
    this.value = "";
    this.remainingInput = defaultLength;
  }
  reset() {
    this.value = "";
    this.remainingInput = this.defaultLength;
  }
}

export enum FormattedDateSections {
  MONTH_SECTION,
  DATE_SECTION,
  YEAR_SECTION
};

interface State {
  values: {
    MONTH_SECTION: DateSection;
    DATE_SECTION: DateSection;
    YEAR_SECTION: DateSection;
  };
  selectedDateSection: FormattedDateSections;
}

interface DateInputProps {
  onChange?(year, month, date): void;
  dateFormat?: DateFormats;
}

export class DateInputComponent extends React.Component<DateInputProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedDateSection: FormattedDateSections.MONTH_SECTION,
      values: {
        DATE_SECTION: new DateSection("DD", 2, "date"),
        MONTH_SECTION: new DateSection("MM", 2, "month"),
        YEAR_SECTION: new DateSection("YYYY", 4, "year"),
      }
    };
  }
  formattedDate(fmtMonth, fmtDay, fmtYear) {
    if (this.props.dateFormat && this.props.dateFormat == DateFormats.DDMMYYYY) {
      return `${fmtDay}/${fmtMonth}/${fmtYear}`;
    } else {
      return `${fmtMonth}/${fmtDay}/${fmtYear}`;
    }
  }
  selectedFormat() {
    if (this.props.dateFormat && this.props.dateFormat == DateFormats.DDMMYYYY) {
      return DDMMYYFormate;
    } else {
      return MMDDYYFormate;
    }
  }
  dateValue() {
    const date = this.state.values.DATE_SECTION;
    const month = this.state.values.MONTH_SECTION;
    const year = this.state.values.YEAR_SECTION;

    const fmtDay = !!date.value ? this.stringPadding(date.defaultLength, date.value) : date.defaultFmt;
    const fmtMonth = !!month.value ? this.stringPadding(month.defaultLength, month.value) : month.defaultFmt;
    const fmtYear = !!year.value ? this.stringPadding(year.defaultLength, year.value) : year.defaultFmt;
    return this.formattedDate(fmtMonth, fmtDay, fmtYear);
  }
  setNewSelectionRange(section: FormattedDateSections) {
    const selectedSection = this.state.values[FormattedDateSections[section]] as DateSection;
    selectedSection.remainingInput = selectedSection.defaultLength;
    this.state.values[FormattedDateSections[section]] = selectedSection;
    this.state.selectedDateSection = section;
    this.setState(this.state);
  }
  onSelect(start: number, end: number) {
    let selectedSelection;
    const format = this.selectedFormat();
    for (let dateSection in format) {
      if (format.hasOwnProperty(dateSection)) {
        if (start >= format[dateSection].start && start <= format[dateSection].end) {
          selectedSelection = FormattedDateSections[dateSection];
        }
      }
    }
    this.setNewSelectionRange(selectedSelection);
  }
  callOnChangeCallback(){
    if(this.props.onChange){
      const year =this.state.values.YEAR_SECTION.value;
      const month =this.state.values.MONTH_SECTION.value;
      const date =this.state.values.DATE_SECTION.value;
      this.props.onChange(year, month, date);
    }
  }
  onKeydown(key: string, e: Event) {
    let nextSection;
    const selectedIndex = this.state.selectedDateSection;
    if (key == ArrowRight) {
      nextSection = this.nextDateSection(selectedIndex);
    }
    else if (key == ArrowLeft) {
      nextSection = this.previousDateSection(selectedIndex);
    }
    else if (key == Tab) {
      nextSection = this.nextDateSection(selectedIndex);
      if (selectedIndex === nextSection) {
        return;
      }
    }
    else if (key == Backspace) {
      const selectedValue = this.state.values[FormattedDateSections[selectedIndex]] as DateSection;
      if (selectedValue.value == "") {
        nextSection = this.previousDateSection(selectedIndex);
      } else {
        nextSection = selectedIndex;
        selectedValue.reset();
        this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
        this.setState(this.state);
      }
    }
    else if(key == ArrowDown){
      nextSection = selectedIndex;
      const selectedValue = this.state.values[FormattedDateSections[selectedIndex]] as DateSection;
      if(selectedValue.value != "" && parseInt(selectedValue.value) >= 0){
        const newValue = parseInt(selectedValue.value) + 1;
        selectedValue.value = newValue.toString();
        this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
        this.setState(this.state);
      }
    }
    else if(key == ArrowUp){
      nextSection = selectedIndex;
      const selectedValue = this.state.values[FormattedDateSections[selectedIndex]] as DateSection;
      if(selectedValue.value != "" && parseInt(selectedValue.value) > 0){
        const newValue = parseInt(selectedValue.value) - 1;
        selectedValue.value = newValue.toString();
        this.state.values[FormattedDateSections[selectedIndex]] = selectedValue;
        this.setState(this.state);
      }
    }

    e.preventDefault();
    this.setNewSelectionRange(nextSection);
    this.callOnChangeCallback();
  }
  onChange(keyChar: number, e: Event) {
    e.preventDefault();
    let {selectedDateSection} = this.state;

    const section = this.state.values[FormattedDateSections[selectedDateSection]] as DateSection;

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
  }
  stringPadding(length, str) {
    const pad = "0000".substring(0, length);
    const ans = pad.substring(0, pad.length - str.length) + str
    return ans;
  }
  nextDateSection(currentSection) {
    return nextDateSection(currentSection, this.props.dateFormat);
  }
  previousDateSection(currentSection) {
    return previousDateSection(currentSection, this.props.dateFormat);
  }
  render() {
    return (
      <DateInput
        dateFormate = {this.props.dateFormat}
        onChange={(key, e) => {
          this.onChange(key, e);
        } }
        onKeyDown={(keyCode, e) => {
          this.onKeydown(keyCode, e);
        } }
        onSelect={(start, end) => this.onSelect(start, end) }
        value={this.dateValue() }
        selectedDateSection={this.state.selectedDateSection}
        />
    );
  }
}

interface InputProps {
  onKeyDown(key: string, e): void;
  onSelect(start: number, end: number): void;
  onChange(keyCode: number, e): void;
  selectedDateSection: FormattedDateSections;
  dateFormate: DateFormats;
  value: any;
}

export class DateInput extends React.Component<InputProps, {}> {
  el: HTMLInputElement;
  getSelectedDateFormat(){
    if(this.props.dateFormate === DateFormats.DDMMYYYY){
      return DDMMYYFormate;
    }
    else{
      return MMDDYYFormate;
    }
  }
  componentDidUpdate() {
    const selectedSection = FormattedDateSections[this.props.selectedDateSection];
    let selectedFormate = this.getSelectedDateFormat();
    const {start, end} = selectedFormate[selectedSection];
    this.el.setSelectionRange(start, end);
  }
  render() {
    const {onKeyDown, onSelect, onChange} = this.props;

    return (
      <div className="form-group">
        <div className="input-group">
          <input
            ref = {(ref => this.el = ref) }
            type="text"
            className="form-control"
            value={this.props.value}
            onChange={(e) => { } }
            onKeyDown={(e) => {
              if (e.keyCode >= 48 && e.keyCode <= 57) {
                onChange(e.keyCode, e);
              }
              else {
                onKeyDown(e.key, e);
              }
            } }
            onSelect={(e) => {
              e.preventDefault();
              const [start, end] = [this.el.selectionStart, this.el.selectionEnd];
              onSelect(start, end);
            } }
            />
        </div>
      </div>
    );
  }
}
