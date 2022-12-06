import React, { Component } from 'react'; 
import axios from "axios"; 
import Joke from './Joke';
import './JokeList.css';
import {v4 as uuid} from 'uuid';
const JOKES_API_URL = "https://icanhazdadjoke.com/";



export default class JokeList extends Component {
   
    static defaultProps = { 
        numJokesToGet: 10
    };

    // The constructor will initialize state with existing jokes from local storage
    // if there are any, otherwise, it will create an empty array and set of "seenJokes"
    // seenJokes is a used to prevent fetching repeats from the API
    constructor(props) {
        super(props); 
        this.state = { 
            jokes: JSON.parse(window.localStorage.getItem("jokes")) || [],
            loading: false 
        }; 
        this.seenJokes = new Set(this.state.jokes.map(j => j.text)); 
        this.handleClick = this.handleClick.bind(this); 
    }

    // Loads at the start of the render cycle
    componentDidMount() {
        //Load Jokes (if none are in localStorage)
        if (this.state.jokes.length === 0) {
            this.getJokes(); 
        }
    }

    async getJokes() {
        try {
            let jokes = []; 
            while (jokes.length < this.props.numJokesToGet) {
                let res = await axios.get(JOKES_API_URL,
                { headers: { Accept: "application/json "}}); // Gets json version of request, instead of html default 
                // console.log(res.data.joke); 
                let newJoke = res.data.joke; 
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
                } 
                // else {
                //     console.log(`Encountered duplicate joke! ${newJoke}`);
                // }
            }
            // console.log(jokes); 
            this.setState(st => (
                {
                    jokes: [...st.jokes, ...jokes],
                    loading: false 
                }
                ),
            // Store jokes to local storage to save on refresh
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            );
        } catch(err) {
            alert(err); 
        }
    }

    // Changes state to loading and calls getJokes as a callback after updating loading
    handleClick() {
       this.setState({loading: true}, this.getJokes); 
    }

    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j => 
                j.id === id ? {...j, votes: j.votes + delta} : j
            )
        }),
        () => 
            window.localStorage.setItem("jokes", 
                                        JSON.stringify(this.state.jokes))
        );
    }
  
    render() { 
        if(this.state.loading) {
            return (
              <div className="JokeList-spinner">
                <i className="far fa-8x fa-laugh fa-spin" />
                <h1 className="JokeList-title">Loading...</h1>
              </div> 
            );
        }

        let sortedJokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
        const jokeList = sortedJokes.map(j => (
            <Joke 
                id={j.id} 
                key={j.id} 
                votes={j.votes} 
                text={j.text}
                upvote={() => this.handleVote(j.id, 1)}
                downvote={() => this.handleVote(j.id, -1)}/>
        ));
       
        return (
        <div className="JokeList">
        <div className="JokeList-sidebar">
            <h1 className="JokeList-title">
                <span>Dad</span> Jokes
            </h1>
            <img 
                alt="laughing emoji"
                src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'    
            />
            <button className="JokeList-getmore" onClick={this.handleClick}>Fetch Jokes</button>
        </div>
            <div className="JokeList-jokes">
                { jokeList }
            </div>
        </div>
        ); 
    }
}