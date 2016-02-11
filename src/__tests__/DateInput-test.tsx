import React = require("react");
import {
  FormattedDateSections,
  DateInput,
  DateInputComponent,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Tab,
  Backspace,
  DateSection,
  DateFormats
} from "../DateInput";

import { findDOMNode } from 'react-dom';
import {createRenderer, renderIntoDocument} from "react-addons-test-utils";

describe("DateInput", () => {
  const onKeyDown = () => console.log("onKeyDown");
  const onSelect = () => console.log("onSelect");
  const onChange = () => console.log("onChange");
  const dateFormat = "MM/DD/YYYY";
  const event = new Event("Test");

  let renderer;
  const getDateInstance = () => {
    return (
      <DateInput
        selectedDateSection={FormattedDateSections.MONTH_SECTION}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onSelect = {onSelect}
        value = {dateFormat}
        dateFormate={DateFormats.MMDDYYYY}/>
    );
  }
  it("render a component", () => {
    renderer = createRenderer();
    renderer.render(getDateInstance());
    let dateInput = renderer.getRenderOutput();
    expect(dateInput).toEqualJSX(
      <div className="form-group">
        <div className="input-group">
          <input
            ref = {(ref) => this.el = ref}
            type="text"
            className="form-control"
            value={dateFormat}
            onChange={ onChange }
            onKeyDown={ onKeyDown }
            onSelect={ onSelect }
            />
        </div>
      </div>
    );
  })

  describe(".onSelection format MM/DD/YYYY", () => {
    let dateComponent;
    beforeEach(()=>{
      dateComponent = renderIntoDocument(<DateInputComponent/>) as DateInputComponent;
    });
    it("selects month", () => {
      dateComponent.onSelect(1, 1);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const monthSection = FormattedDateSections[FormattedDateSections.MONTH_SECTION];
      expect(selectedSection).toEqual(monthSection);
    })

    it("selects date", () => {
      dateComponent.onSelect(3, 3);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const monthSection = FormattedDateSections[FormattedDateSections.DATE_SECTION];
      expect(selectedSection).toEqual(monthSection);
    })
    it("selects year", () => {
      dateComponent.onSelect(6, 6);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const yearSection = FormattedDateSections[FormattedDateSections.YEAR_SECTION];
      expect(selectedSection).toEqual(yearSection);
    })
  });
  describe(".onSelection format DD/MM/YYYY", () => {
    let dateComponent;
    beforeEach(()=>{
      dateComponent = renderIntoDocument(<DateInputComponent  dateFormat={DateFormats.DDMMYYYY}/>) as DateInputComponent;
    });
    it("selects month", () => {
      dateComponent.onSelect(1, 1);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const dateSection = FormattedDateSections[FormattedDateSections.DATE_SECTION];
      expect(selectedSection).toEqual(dateSection);
    })

    it("selects date", () => {
      dateComponent.onSelect(3, 3);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const monthSection = FormattedDateSections[FormattedDateSections.MONTH_SECTION];
      expect(selectedSection).toEqual(monthSection);
    })
    it("selects year", () => {
      dateComponent.onSelect(6, 6);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const yearSection = FormattedDateSections[FormattedDateSections.YEAR_SECTION];
      expect(selectedSection).toEqual(yearSection);
    })
  });

  describe(".onKeydown format MM/DD/YYYY", () => {
    let dateComponent: DateInputComponent;
    beforeEach(()=>{
      dateComponent = renderIntoDocument(<DateInputComponent/>) as DateInputComponent;
    });
    it("ArrowRight", ()=>{
      dateComponent.onKeydown(ArrowRight, event);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const dateSection = FormattedDateSections[FormattedDateSections.DATE_SECTION];
      expect(selectedSection).toEqual(dateSection);
    });
    it("ArrowLeft", ()=>{
      dateComponent.onKeydown(ArrowLeft, event);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const dateSection = FormattedDateSections[FormattedDateSections.MONTH_SECTION];
      expect(selectedSection).toEqual(dateSection);
    });
    it("Arrow Down increases the number initialized", ()=>{
      dateComponent.onChange('0'.charCodeAt(0), event);
      dateComponent.onKeydown(ArrowDown, event);
      console.log("date component", dateComponent.state);
      let date = dateComponent.state.values[FormattedDateSections[FormattedDateSections.MONTH_SECTION]];
      expect(date.value).toEqual('1');
    })
    it("Arrow Up decreases the number", ()=>{
      dateComponent.onChange('1'.charCodeAt(0), event);
      dateComponent.onKeydown(ArrowUp, event);
      console.log("date component", dateComponent.state);
      let date = dateComponent.state.values[FormattedDateSections[FormattedDateSections.MONTH_SECTION]];
      expect(date.value).toEqual('0');
    })
    it("Tab", ()=>{
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Tab, event);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const yearSection = FormattedDateSections[FormattedDateSections.YEAR_SECTION];
      expect(selectedSection).toEqual(yearSection);
    });

    it("resets if the value is not reset on First Backspace", ()=>{
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Tab, event);
      dateComponent.onChange('1'.charCodeAt(0), event);
      dateComponent.onChange('9'.charCodeAt(0), event);
      dateComponent.onChange('9'.charCodeAt(0), event);
      dateComponent.onChange('8'.charCodeAt(0), event);
      let year = dateComponent.state.values[FormattedDateSections[FormattedDateSections.YEAR_SECTION]];
      expect(year.value).toEqual("1998");
      dateComponent.onKeydown(Backspace, event);
      year = dateComponent.state.values[FormattedDateSections[FormattedDateSections.YEAR_SECTION]];
      expect(year.value).toEqual("");
    });

    it("switches to new selection region on Backspace", ()=>{
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Backspace, event);
      const selectedSection = FormattedDateSections[dateComponent.state.selectedDateSection];
      const monthSection = FormattedDateSections[FormattedDateSections.MONTH_SECTION];
      expect(selectedSection).toEqual(monthSection);
    });
    it("on Tab when selection is in last date section", ()=>{
      spyOn(event, 'preventDefault').and.callThrough();
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Tab, event);
      expect(event.preventDefault).toHaveBeenCalledTimes(2);
    })
  });
  describe(".onChange MM/DD/YYYY", ()=>{
    let dateComponent: DateInputComponent;
    beforeEach(()=>{
      dateComponent = renderIntoDocument(<DateInputComponent/>) as DateInputComponent;
    });

    it("year input", ()=>{
      dateComponent.onKeydown(Tab, event);
      dateComponent.onKeydown(Tab, event);
      dateComponent.onChange('1'.charCodeAt(0), event);
      dateComponent.onChange('9'.charCodeAt(0), event);
      dateComponent.onChange('9'.charCodeAt(0), event);
      dateComponent.onChange('8'.charCodeAt(0), event);
      const year = dateComponent.state.values[FormattedDateSections[FormattedDateSections.YEAR_SECTION]];
      expect(year.value).toEqual("1998");
    })

    it("date input", ()=>{
      dateComponent.onKeydown(ArrowRight, event);
      dateComponent.onChange('1'.charCodeAt(0), event);
      dateComponent.onChange('2'.charCodeAt(0), event);
      const date = dateComponent.state.values[FormattedDateSections[FormattedDateSections.DATE_SECTION]];
      expect(date.value).toEqual("12");
    })

    it("month input", ()=>{
      dateComponent.onChange('1'.charCodeAt(0), event);
      dateComponent.onChange('2'.charCodeAt(0), event);
      const month = dateComponent.state.values[FormattedDateSections[FormattedDateSections.MONTH_SECTION]] as DateSection;
      expect(month.value).toEqual("12");
      expect(dateComponent.state.selectedDateSection).toEqual(FormattedDateSections.DATE_SECTION);
      dateComponent.onKeydown(ArrowLeft, event);

      expect(month.remainingInput).toEqual(month.defaultLength);
      dateComponent.onChange('1'.charCodeAt(0), event);
      expect(month.value).toEqual("1");
    })
  })
});
