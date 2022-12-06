import React, { Component } from 'react'; 
import './Joke.css';


export default class Joke extends Component {

    getColorAndEmoji() {
        let { votes } = this.props; 
        if (votes >= 15) {
            return { color: "#4CAF50" , emoji: "em em-rolling_on_the_floor_laughing" };
        } else if (votes >= 12) {
            return { color: "#8BC34A" , emoji: "em em-laughing" };
        } else if (votes >= 9) {
            return { color: "#CDDC39", emoji: "em em-smiley" };
        } else if (votes >= 6) {
            return { color: "#FFEB3B", emoji: "em em-slightly_smiling_face" };
        } else if (votes >= 3) {
            return { color: "#FFC107", emoji: "em em-neutral_face" };
        } else if (votes >= 0) {
            return { color: "#FF9800", emoji: "em em-confused" };
        } else {
            return { color: "#F44336", emoji: "em em-angry" };
        }
    }

    render() {
        let colorEmoji = this.getColorAndEmoji();  
        return (
            <div className="Joke">
                <div className="Joke-buttons">
                    <i className='fas fa-arrow-up' onClick={this.props.upvote}></i>
                    <span 
                    className="Joke-votes"
                    style={{borderColor: colorEmoji.color}}>
                        {this.props.votes}
                    </span>
                    <i className='fas fa-arrow-down' onClick={this.props.downvote}></i>
                </div>
                <div className="Joke-text">
                    {this.props.text}
                </div>
                <div className="Joke-smiley">
                    <i className={colorEmoji.emoji} />
                </div>
            </div>
        );
    }
}