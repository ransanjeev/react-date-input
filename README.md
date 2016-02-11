# react-date-input
  - React Input component for date
  - This allows user to input date by using numbers in given format.
  - Supported formats are MM/DD/YYYY and DD/MM/YYYY.
  - LeftArrow to go to left date section
  - RightArrow to go to right date section
  - UpArrow to decrement the selected date section
  - DownArrow to increment the selected date section
  - Tabs to jump to next date section
  - Backspace/Delete to reset the selected date section.

# Installation
npm install react-controlled-date-input

#usage
```js 

import React = require("react");
import ReactDOM = require("react-dom");
import {DateInputComponent, DateFormats } from "react-controlled-date-input";

class Container extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      month: "",
      date: ""
    };
  }
  onChange(year, month, date) {
    this.setState({ year, month, date });
  }
  render() {
    let {year, month, date} = this.state;
    if(!!!year) {year = "YYYY"};
    if(!!!month) {month = "MM"};
    if(!!!date) {date = "DD"};

    return (
      <div>
        <DateInputComponent
          onChange={this.onChange.bind(this)}
          dateFormat={DateFormats.DDMMYYYY}/>
        <label>Date <h3>{`${date}/${month}/${year}`}</h3></label>
      </div>
    );
  }
}

ReactDOM.render(
  <Container/>,
  document.getElementById('root')
);

```
