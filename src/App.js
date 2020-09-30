import React from "react";
import axios from "axios";
import "./styles.css";
import _ from "lodash";

export default class App extends React.Component {
  state = {
    jsonValue: [],
    datarecords: [],
    datacolumns: [],
    datarecordsMonday: [],
    datarecordsTuesday: [],
    datarecordsWednesday: [],
    datarecordsThursday: [],
    datarecordsFriday: [],
  };

  componentWillMount() {
    axios.get("/timetable").then((response) => {
      this.setState({
        datarecords: response.data,
        datarecordsMonday: response.data.Monday,
        datarecordsTuesday: response.data.Tuesday,
        datarecordsWednesday: response.data.Wednesday,
        datarecordsThursday: response.data.Thursday,
        datarecordsFriday: response.data.Friday,
      });

      this.extractColumnNames();
    });
  }

  extractColumnNames() {
    const datacolumns = this.state.datacolumns;

    const firstrecord = _.keys(this.state.datarecords.Monday[0]); // <-- This is okey because each day follows the same data structure [6 attributes]
    this.setState({ datacolumns: firstrecord });
  }

  displayRecords(key, day) {
    const datacolumns = this.state.datacolumns;
    return datacolumns.map((each_col) =>
      this.displayRecordName(each_col, key, day)
    );
  }

  displayRecordName(colname, key, day) {
    const datarecords = this.state.datarecords;

    var record = "";
    switch (day) {
      case 0:
        record = datarecords.Monday[key];
        break;

      case 1:
        record = datarecords.Tuesday[key];
        break;

      case 2:
        record = datarecords.Wednesday[key];
        break;

      case 3:
        record = datarecords.Thursday[key];
        break;

      case 4:
        record = datarecords.Friday[key];
        break;
    }
    return <th>{record[colname]}</th>;
  }

  render() {
    const datarecords = this.state.datarecords;
    const datarecordsMonday = this.state.datarecordsMonday;
    const datarecordsTuesday = this.state.datarecordsTuesday;
    const datarecordsWednesday = this.state.datarecordsWednesday;
    const datarecordsThursday = this.state.datarecordsThursday;
    const datarecordsFriday = this.state.datarecordsFriday;
    let button;

    if (datarecords.length === 0) {
      button = "";
    } else {
    }

    return (
      <div>
        {datarecords.length === 0 && (
          <div className="text-center">
            <h2>Please wait...</h2>
          </div>
        )}
        <div className="container">
          <div className="row">
            <table className="table table-bordered">
              <tbody>
                <h2>Monday</h2>
                {datarecordsMonday &&
                  datarecordsMonday.map((each_datarecord, recordindex) => (
                    <tr key={each_datarecord.startTime}>
                      {this.displayRecords(recordindex, 0)}
                    </tr>
                  ))}
                <h2>Tuesday</h2>
                {datarecordsTuesday &&
                  datarecordsTuesday.map((each_datarecord, recordindex) => (
                    <tr key={each_datarecord.startTime}>
                      {this.displayRecords(recordindex, 1)}
                    </tr>
                  ))}
                <h2>Wednesday</h2>
                {datarecordsWednesday &&
                  datarecordsWednesday.map((each_datarecord, recordindex) => (
                    <tr key={each_datarecord.startTime}>
                      {this.displayRecords(recordindex, 2)}
                    </tr>
                  ))}
                <h2>Thursday</h2>
                {datarecordsThursday &&
                  datarecordsThursday.map((each_datarecord, recordindex) => (
                    <tr key={each_datarecord.startTime}>
                      {this.displayRecords(recordindex, 3)}
                    </tr>
                  ))}
                <h2>Friday</h2>
                {datarecordsFriday &&
                  datarecordsFriday.map((each_datarecord, recordindex) => (
                    <tr key={each_datarecord.startTime}>
                      {this.displayRecords(recordindex, 4)}
                    </tr>
                  ))}
              </tbody>
            </table>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
}
