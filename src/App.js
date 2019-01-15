import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    youngestUserList: "user list"
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/youngest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const body = await response.text();
    console.log(JSON.parse(body).cachedYoungestUserList)
    
    this.setState({youngestUserList:body});
    console.log(this.state)
  };

render() {
    return (
      <div className="App">
        <header>
        </header>
        <p>appsheet project</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Get from Server:</strong>
          </p>
          <button type="submit">Get Top Five Youngest</button>
        </form>
        <p>{this.state.youngestUserList}</p>
      </div>
    );
  }
}

export default App;
