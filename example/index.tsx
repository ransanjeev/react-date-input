import React = require("react");
import ReactDOM = require("react-dom");
import {DateInputComponent, DateFormats } from "../src/DateInput";


class Container extends React.Component<{
}, {
    year: string;
    month: string;
    date: string;
  }>{
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
        <div>
          <h3>Component</h3>
          <DateInputComponent
            onChange={this.onChange.bind(this)}
            dateFormat={DateFormats.DDMMYYYY}/>
        </div>
        <div className="date-preview">
          <h3>Date Preview</h3>
          <p>{`${date}/${month}/${year}`}</p>
        </div>

      </div>
    );
  }
}

ReactDOM.render(
  <Container/>,
  document.getElementById('root')
);
