//import './App.css';
import React, {Component} from 'react'
import Card from './components/Card'
import './styles/Card.css'

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      allData: false
    }
  }

  componentDidMount() {
    fetch(`https://kwietniewski.ml/timetable/`)
        .then(response => response.json())
        .then(json => this.setState(
          {monday: json.Monday,tuesday: json.Tuesday,wednesday: json.Wednesday,thursday: json.Thursday,friday: json.Friday, allData: true}))
  }

  render(){
    const allData = this.state.allData;
    return (
      <ul>
        <h1 className="card-container">
          { allData ? '' : 'Please wait...' }
        </h1>
        <h1 className="day-header">Monday</h1>
        {this.state.monday.map((lesson, index) => {
          return (
            <Card code={lesson.code} startTime={lesson.startTime} endTime={lesson.endTime} location={lesson.location} weeks={lesson.weeks} leader={lesson.leader} key={index} />
          )
        })}
        <h1 className="day-header">Tuesday</h1>
        {this.state.tuesday.map((lesson, index) => {
          return (
            <Card code={lesson.code} startTime={lesson.startTime} endTime={lesson.endTime} location={lesson.location} weeks={lesson.weeks} leader={lesson.leader} key={index} />
          )
        })}
        <h1 className="day-header">Wednesday</h1>
        {this.state.wednesday.map((lesson, index) => {
          return (
            <Card code={lesson.code} startTime={lesson.startTime} endTime={lesson.endTime} location={lesson.location} weeks={lesson.weeks} leader={lesson.leader} key={index} />
          )
        })}
        <h1 className="day-header">Thursday</h1>
        {this.state.thursday.map((lesson, index) => {
          return (
            <Card code={lesson.code} startTime={lesson.startTime} endTime={lesson.endTime} location={lesson.location} weeks={lesson.weeks} leader={lesson.leader} key={index} />
          )
        })}
        <h1 className="day-header">Friday</h1>
        {this.state.friday.map((lesson, index) => {
          return (
            <Card code={lesson.code} startTime={lesson.startTime} endTime={lesson.endTime} location={lesson.location} weeks={lesson.weeks} leader={lesson.leader} key={index} />
          )
        })}

      </ul>
    )
  }
}

export default App;
