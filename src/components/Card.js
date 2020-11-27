import React, {Component} from 'react';

class Card extends Component {
    constructor(props){
        super(props)

        this.state = {
            code: props.code,
            info: [
                {title: props.startTime, text: props.endTime},
                {title: 'Location', text: props.location},
                {title: 'Weeks', text: props.weeks},
                {title: 'Professor', text: props.leader}
            ]
        }
    }
    render(){
        const {
            code,
            initials,
            info
        } = this.state
        return(
            <React.Fragment>
                <section className="card-container">
                    <header className="card-header">
                        <h2>{code}</h2>
                    </header>
                    <main>
                        <ul>
                           {info.map((row,index) => {
                                return (
                                    <li key={index}>
                                        <span>{row.title}</span>
                                        {row.text ? row.text : 'N/A'}
                                    </li>
                                )
                            })}
                        </ul>
                    </main>
                </section>
            </React.Fragment>
        )
    }
}
export default Card