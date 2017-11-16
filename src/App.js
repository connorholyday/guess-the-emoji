import React, { Component } from 'react';
import './App.css';
import emojiList from './emojiList.js';
import complimentList from './complimentList.js';
import Logo from './Logo.js';

const Option = ({clickHandler, emoji}) => <span className="emoji" onClick={() => clickHandler(emoji)}>{emoji}</span>

class App extends Component {
  constructor() {
    super();

    this.state = {
      choices: 2,
      streak: 0,
      hiScore: 0,
      difficulty: 0,
      correct: false,
      guessed: false,
      answer: '',
      options: []
    };

  }

  componentWillMount() {
    this.setEmoji();
    this.addKeyListeners();
  }

  setEmoji = () => {
    let workingList = [...emojiList];

    const answer = workingList.splice(this.getRandom(workingList.length), 1)[0];
    let options = [];

    for ( let i = 0; i < this.state.choices; i++ ) {
      options.push(workingList.splice(this.getRandom(workingList.length), 1)[0]);
    }

    options.splice(this.getRandom(this.state.choices + 1), 0, answer);

    this.setState({
      guessed: false,
      answer,
      options
    });

  }

  addKeyListeners() {
    document.addEventListener('keyup', (e) => {

      if (this.state.guessed) {
        return;
      }

      const keyCode = e.keyCode;
      let index = -1;

      if (keyCode === 49) {
        index = 0;
      } else if (keyCode === 50) {
        index = 1;
      } else if (keyCode === 51) {
        index = 2;
      }

      index !== -1 && this.checkAnswer(this.state.options[index]);
    });
  }

  getRandom(length) {
    let min = Math.ceil(0);
    let max = Math.floor(length + 1);

    return Math.floor(Math.random() * (max - 1)) + min;
  }

  getCompliment() {
    let result = this.getRandom(complimentList.length);
    return complimentList[result] + '!';
  }

  checkAnswer = (guess) => {

    if (this.state.guessed) {
      return;
    }

    const correct = this.state.answer === guess;

    this.setState(prevState => {
      let streak = correct ? prevState.streak + 1 : 0;
      let hiScore = streak > prevState.hiScore ? streak : prevState.hiScore;
      let difficulty = streak >= 10 ? 10 + ((streak - 10) / 2) : streak;

      return {
        guessed: true,
        correct,
        streak,
        difficulty,
        hiScore
      }
    });

    setTimeout(this.nextQuestion, 600);
  }

  nextQuestion = () => {
    this.setState({correct: false});
    this.setEmoji();
  }

  render() {

    document.documentElement.style.setProperty(`--difficulty`, this.state.difficulty);

    return (
      <div className="App">
        <main>
          <Logo />
          <div className={'bg ' + (this.state.correct ? '' : ' bg--blurred ') + ((!this.state.correct && this.state.guessed) ? ' is-shake ' : '')}>
            <span className="emoji emoji--large">{this.state.answer}</span>
          </div>
          <h1>{this.state.correct ? this.getCompliment() : 'Choose...' }</h1>
          <div className="options">
            {this.state.options.map((choice, i) => <Option key={i} className="emoji" clickHandler={this.checkAnswer} emoji={choice} />) }
          </div>
          <div className="score">
            <span>Score: {this.state.streak}</span>
            <span>Top Score: {this.state.hiScore}</span>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
