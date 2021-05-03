import {Component} from 'react'

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

 async handleCheck(e){
   const response = await fetch(`https://mail-tracker-server.herokuapp.com/api/check/${this.state.key}`)
   const json = await response.json()
   //take the views
   this.setState(json)
 }


  render() {
    return(
      <div>
        {
          this.state.key.length == 0 ? 
            <button onClick={(e) => this.handleClick(e)}>Gimme Tracker</button>
            :
            <div>
              <button onClick={(e) => this.handleCheck(e)}>Refresh To See!</button>
              <a href={`https://mail-tracker-server.herokuapp.com/api/track/${this.state.key}`} target='_blank'>Try Your Key</a>
            </div>
        }
        <div>
          <ul>
            {
              this.state.views.map((view) => {
                let date = new Date(view.date)
                return(
                  <li key={view.date.toString()}>viewed at {date.toLocaleString()} from {view.location.city} via {view.ua.browser.name}</li>
                ) 
              })
            }
          </ul>
        </div>
            
      </div>
    )
  }
}

export default App;
//handlecheck makes an api call to /check/key
//returns the viewers data
