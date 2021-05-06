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
    this.interval = null
    this.state = {
      key: "",
      password: "",
      views: [],
    }
  }

  async handleClick(e) {
    const response = await fetch(`${getApiUrl()}/api`)
    const json = await response.json()
    this.setState(json)
    const url = new URL(window.location)
    url.searchParams.set('key', json.key)
    url.searchParams.set('password', json.password || 'test')
    window.history.pushState({}, '', url)

    if (!this.interval) {
      this.interval = setInterval(() => {
        this.handleCheck()
      }, 5000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
    const url = new URL(window.location)
    const key = url.searchParams.get('key')
    const password = url.searchParams.get('password')
    if (key && password) {
      this.setState({ key, password })
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.handleCheck()
        }, 5000)
      }
    }
  }

  async handleCheck(e) {

    const response = await fetch(`${getApiUrl()}/api/check/${this.state.key}/${this.state.password}`)
    const json = await response.json()
    //take the views
    this.setState(json)

  }

  handleCopy(e) {
    document.getElementById("copyIndicator").innerText = "Copied!"
    const copyText = document.getElementById("copyText").innerText
    const temp = document.createElement("INPUT")
    temp.value = copyText
    document.body.appendChild(temp)
    temp.select()
    document.execCommand("copy")
    temp.remove()
    document.getElementById("note").innerText = "Please place this link in your preffered mail application as an image url and you are good to go!"
  }

  handleBookmark(e) {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(window.location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  }


  render() {
    return (
      <div className="container">
        <div className="space">
          {
            this.state.key.length === 0 ?
              <button className="button space" onClick={(e) => this.handleClick(e)}>Gimme Tracker</button>
              :
              <button className="button space" onClick={(e) => this.handleBookmark(e)}>Add your address to bookmark!</button>
          }
        </div>
        <div className="space">{this.state.key.length > 0 &&
          <div className="copy-link-wrapper border" onClick={(e) => this.handleCopy(e)}>
            <span className="ellipsis" id="copyText">{`${getApiUrl()}/api/track/${this.state.key}`}</span>
            <span id="copyIndicator">Copy</span>
          </div>}
        </div>
        <b className="copyDesc space" id="note"></b>
        {this.state.views.length > 0 && (
          <div>
            <h1>Views:</h1>
            <div className="border scroll-view">
              {
                this.state.views.map((view) => {
                  let date = new Date(view.date)
                  return (
                    <div key={view.date.toString()}>viewed at {date.toLocaleString()} from {view.location.city} via {view.ua.browser.name}</div>
                  )
                })
              }
            </div>
          </div>
        )}


      </div>
    )
  }
}

export default App;
//handlecheck makes an api call to /check/key
//returns the viewers data
