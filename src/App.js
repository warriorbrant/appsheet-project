import React, { Component } from 'react';

import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state={userList:[]}
  }

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
    let userObjectList=JSON.parse(body).cachedYoungestUserList
    let userList=[];
    for(let i=0;i<5;i++){
      let curUser=[];
      curUser.push(userObjectList[i].id)
      curUser.push(userObjectList[i].name)
      curUser.push(userObjectList[i].age)
      curUser.push(userObjectList[i].number)
      curUser.push(userObjectList[i].bio)
      userList.push(curUser)
    }
    this.setState({userList:userList});
    console.log(this.state)
  };

render() {
    let table=[]
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
        <table>
          <tr>
            <td>id</td>
            <td>name</td>
            <td>age</td>
            <td>phone</td>
            <td>bio</td>
          </tr>
           {
            this.state.userList.forEach(user=>{
              console.log(user)
              table.push(<tr>
                          <td>{user[0]}</td>
                          <td>{user[1]}</td>
                          <td>{user[2]}</td>
                          <td>{user[3]}</td>
                          <td>{user[4]}</td>
                        </tr>)
              })
           }
           {table}
        </table>
        
      </div>
    );
  }
}

export default App;
