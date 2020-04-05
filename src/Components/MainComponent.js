import React from "react";
import "./Styles.css";
import { ReactComponent as YoutubeIcon } from "../media/youtube.svg";
import { ReactComponent as SearchIcon } from "../media/search.svg";
import Footer from "./Footer.js";

const apiKey = require("../apiKey.json")["apiKey"];
const searchModule = require("youtube-search");
const searchOptions = {
  maxResults: 10,
  key: apiKey,
};

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: null,
      searchResults: [],
      playlist: [],
    };
  }

  componentDidMount() {
    //Add eventListener to searchInput
    document
      .getElementById("searchInput")
      .addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
          // 'ENTER' = 13
          this.search();
        }
      });
  }

  search = () => {
    // return;
    const searchTerm = document.getElementById("searchInput").value;
    searchModule(searchTerm, searchOptions, (error, results) => {
      if (error) {
        return console.log("SearchModule error", error);
      }
      console.log("SearchModule results:", results);
      this.setState({ searchResults: results });
    });
  };

  cleanString = (string) => {
    return string
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, "'");
  };

  addToPlaylist = (index) => {
    this.setState({
      playlist: [...this.state.playlist, this.state.searchResults[index]],
    });
  };

  render() {
    return (
      <div>
        <div className="header">
          <YoutubeIcon className="YoutubeIcon" />
          <div className="headerTitle">Playlist</div>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search For Videos"
              id="searchInput"
              className="searchInput"
            ></input>
            <SearchIcon className="SearchIcon" onClick={this.search} />
          </div>
        </div>
        <div className="playlistContainer">
          {this.state.playlist.map((video, index) => (
            <div key={"playlistVideo" + video.id} className="playlistVideo">
              <div>{this.cleanString(video.title)}</div>
              <div>{video.description}</div>
              <img src={video.thumbnails.high.url} alt={video.title}></img>
            </div>
          ))}
        </div>
        <div className="searchResults">
          {this.state.searchResults.map((video, index) => (
            <div
              key={"searchResult" + video.id}
              className="searchResult"
              onClick={() => this.addToPlaylist(index)}
            >
              <div>{this.cleanString(video.title)}</div>
              <img
                width="250px"
                src={video.thumbnails.medium.url}
                alt={video.title}
              ></img>
            </div>
          ))}
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
