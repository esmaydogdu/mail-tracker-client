import { Component } from "react"

const env = "prod"
const BASE = {
  local: "http://localhost:9000",
  prod: "https://mail-tracker-server.herokuapp.com"
}

const getApiUrl = () => {
  return BASE[env]
}

class App extends Component {
  constructor(props) {
    super(props)
    this.timeout = null
    this.state = {
      key: "",
      views: [],
    }
  }

  async handleClick(e) {
    const response = await fetch(`${getApiUrl()}/api`)
    const json = await response.json()
    this.setState(json)

    this.timeout = setInterval(() => {
      this.handleCheck()
    }, 5000);
  }

  componentWillUnmount(){
    clearInterval(this.timeout)
  }

  async handleCheck(e) {
    const response = await fetch(`${getApiUrl()}/api/check/${this.state.key}`)
    const json = await response.json()
    //take the views
    this.setState(json)
  }

  handleCopy(e) {
    document.getElementById("copyIndicator").innerText = "Copied!"
    const copyText = document.getElementById("copyText").innerText
    const temp = document.createElement("INPUT");
    temp.value = copyText;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    document.getElementById("note").innerText = "Please place this link in your preffered mail application as an image url and you are good to go!"
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
          <div className="copy-link-wrapper border" onClick={(e) => this.handleCopy(e)}>
            <span id="copyText">{`${getApiUrl()}/api/track/${this.state.key}`}</span>
            <span id="copyIndicator">Copy</span>
          </div>}
        </div>
        <b className="copyDesc space" id="note"></b>
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
