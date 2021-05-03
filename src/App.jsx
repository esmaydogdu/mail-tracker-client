import { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: '',
      views: []
    }
  }
  async handleClick(e) {
    const response = await fetch('https://mail-tracker-server.herokuapp.com/api')
    const json = await response.json()
    this.setState(json)
  }

  async handleCheck(e) {
    const response = await fetch(`https://mail-tracker-server.herokuapp.com/api/check/${this.state.key}`)
    const json = await response.json()
    //take the views
    this.setState(json)
  }


  render() {
    return (
      <div className="container">
        <div className="space">
          {
            this.state.key.length === 0 ?
              <button className="button space" onClick={(e) => this.handleClick(e)}>Gimme Tracker</button>
              :
              <button className="button space" onClick={(e) => this.handleCheck(e)}>Refresh To See!</button>
          }
        </div>
        <div className="space">{this.state.key.length > 0 &&
          <div className="copy-link-wrapper border">
            <span>{`https://mail-tracker-server.herokuapp.com/api/track/${this.state.key}`}</span>
            <span>Copy</span>
          </div>}
        </div>
        <div>
          {this.state.views.length > 0 && <h1>Views:</h1>}
          <div>
            {
              this.state.views.map((view) => {
                let date = new Date(view.date)
                return (
                  <div className="space" key={view.date.toString()}>viewed at {date.toLocaleString()} from {view.location.city} via {view.ua.browser.name}</div>
                )
              })
            }
          </div>
        </div>
        

      </div>
    )
  }
}

export default App;
//handlecheck makes an api call to /check/key
//returns the viewers data
