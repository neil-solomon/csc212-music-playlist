import React from "react";
import "./Styles.css";
import { ReactComponent as SearchIcon } from "../media/search.svg";
import { ReactComponent as YoutubeIcon } from "../media/youtube.svg";
import {
  GithubFilled,
  CloseCircleOutlined,
  TabletOutlined,
  StepBackwardOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  RetweetOutlined,
  SwapOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import YouTube from "react-youtube";
import MyModal from "./MyModal.js";

const apiKey = require("../apiKey.json")["apiKey"];
const searchModule = require("youtube-search");
const searchOptions = {
  maxResults: 10,
  key: apiKey,
};

var videoPlayerElement = null;

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: 0,
      searchResults: [],
      playlist: [],
      addVideosModalVisible: false,
      videoSize: [0, 0], // height, width
      repeatPlaylist: false,
      shufflePlaylist: false,
      changeCurrentVideoTimeout: null,
      playbackError: false,
      videoPlayerIsPaused: true,
    };
  }

  componentDidMount() {
    this.updateVideoSize();
    window.addEventListener("resize", () => this.updateVideoSize());
  }

  componentWillUnmount() {
    if (this.state.addVideosModalVisible) {
      document
        .getElementById("searchInput")
        .removeEventListener("keyup", (event) => {
          if (event.keyCode === 13) {
            // 'ENTER' = 13
            this.search();
          }
        });
    }
    clearTimeout(this.state.addSearchInputEventListenerTimeout);
    clearTimeout(this.state.changeCurrentVideoTimeout);
    window.removeEventListener("resize", () => this.updateVideoSize());
  }

  updateVideoSize = () => {
    var videoSize = [0, 0];
    if ((9 / 16) * 0.8 * window.innerWidth < window.innerHeight - 60) {
      videoSize[1] = 0.8 * window.innerWidth;
      videoSize[0] = (9 / 16) * videoSize[1];
    } else {
      videoSize[0] = window.innerHeight - 60;
      videoSize[1] = (16 / 9) * videoSize[0];
    }
    this.setState({ videoSize });
  };

  addSearchInputEventListener = () => {
    //Add eventListener to searchInput
    document
      .getElementById("searchInput")
      .addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
          // 'ENTER' = 13
          this.search();
        }
      });
  };

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

  openAddVideosModal = () => {
    this.setState({
      addVideosModalVisible: true,
      addSearchInputEventListenerTimeout: setTimeout(
        () => this.addSearchInputEventListener(),
        100
      ),
    });
  };

  swapCurrentVideo = (videoId) => {
    var index;
    for (let i = 0; i < this.state.playlist.length; ++i) {
      if (this.state.playlist[i].id === videoId) {
        index = i;
      }
    }
    this.setState({ currentVideo: index });
  };

  removePlaylistItem = (videoId) => {
    var index;
    for (let i = 0; i < this.state.playlist.length; ++i) {
      if (this.state.playlist[i].id === videoId) {
        index = i;
      }
    }
    var playlist = [...this.state.playlist];
    playlist.splice(index, 1);
    this.setState({ playlist });
  };

  movePlaylistItem = (videoId, value) => {
    var index;
    for (let i = 0; i < this.state.playlist.length; ++i) {
      if (this.state.playlist[i].id === videoId) {
        index = i;
      }
    }
    if (
      index + value > 0 &&
      index + value < this.state.playlist.length &&
      index + value !== this.state.currentVideo
    ) {
      var playlist = [...this.state.playlist];
      var temp = playlist[index];
      playlist[index] = playlist[index + value];
      playlist[index + value] = temp;
      this.setState({ playlist });
    }
  };

  changeCurrentVideo = (value) => {
    if (this.state.playlist.length === 0) {
      return;
    }
    var currentVideo;
    if (this.state.shufflePlaylist) {
      currentVideo =
        Math.floor(Math.random() * 1000000) % this.state.playlist.length;
    } else {
      currentVideo = this.state.currentVideo + value;
      if (currentVideo === -1) {
        currentVideo = 0;
      } else if (currentVideo === this.state.playlist.length) {
        if (this.state.repeatPlaylist) {
          currentVideo = 0;
        } else {
          currentVideo -= 1;
        }
      }
    }
    this.setState({ currentVideo, playbackError: false });
  };

  toggleRepeatPlaylist = () => {
    if (this.state.repeatPlaylist) {
      this.setState({ repeatPlaylist: false });
    } else {
      this.setState({ repeatPlaylist: true, shufflePlaylist: false });
    }
  };

  toggleShufflePlaylist = () => {
    if (this.state.shufflePlaylist) {
      this.setState({ shufflePlaylist: false });
    } else {
      this.setState({ shufflePlaylist: true, repeatPlaylist: false });
    }
  };

  playbackError = () => {
    this.setState({
      playbackError: true,
      changeCurrentVideoTimeout: setTimeout(
        () => this.changeCurrentVideo(1),
        1000
      ),
    });
  };

  playPauseButtonClick = () => {
    if (videoPlayerElement) {
      if (this.state.videoPlayerIsPaused) {
        videoPlayerElement.target.playVideo();
      } else {
        videoPlayerElement.target.pauseVideo();
      }
      this.setState({ videoPlayerIsPaused: !this.state.videoPlayerIsPaused });
    }
  };

  setVideoPlayerElement = (event) => {
    videoPlayerElement = event;
  };

  render() {
    if (window.innerWidth < window.innerHeight) {
      return (
        <div
          style={{
            backgroundColor: "rgb(225,225,225)",
            height: "100vh",
            width: "100vw",
          }}
        >
          <div className="MusicPlaylist_rotateDeviceContainer">
            <div style={{ height: "30vh" }}></div>
            <div className="MusicPlaylist_rotateDevice">
              <TabletOutlined />
            </div>
            <div style={{ fontSize: 40 }}>Rotate Device</div>
          </div>
        </div>
      );
    }

    var playbackButtonsMarginLeft = (window.innerWidth - 950) / 2;
    if (window.innerWidth <= 850) {
      playbackButtonsMarginLeft = (window.innerWidth - 550) / 2;
    }

    return (
      <div>
        <div className="MusicPlaylist_header">
          <YoutubeIcon className="MusicPlaylist_YoutubeIcon" />
          {window.innerWidth > 850 && (
            <div className="MusicPlaylist_headerTitle">
              <strong>YouTube</strong> Playlist
            </div>
          )}
          <div
            className="MusicPlaylist_playbackButtons"
            style={{ marginLeft: playbackButtonsMarginLeft }}
          >
            <div className="MusicPlaylist_playbackButton">
              <StepBackwardOutlined
                onClick={() => this.changeCurrentVideo(-1)}
              />
            </div>
            <div className="MusicPlaylist_playbackButton">
              {this.state.videoPlayerIsPaused && (
                <PlayCircleOutlined onClick={this.playPauseButtonClick} />
              )}
              {!this.state.videoPlayerIsPaused && (
                <PauseCircleOutlined onClick={this.playPauseButtonClick} />
              )}
            </div>
            <div className="MusicPlaylist_playbackButton">
              <StepForwardOutlined onClick={() => this.changeCurrentVideo(1)} />
            </div>
            {this.state.repeatPlaylist && (
              <div className="MusicPlaylist_playbackButtonActive">
                <RetweetOutlined onClick={this.toggleRepeatPlaylist} />
              </div>
            )}
            {!this.state.repeatPlaylist && (
              <div className="MusicPlaylist_playbackButton">
                <RetweetOutlined onClick={this.toggleRepeatPlaylist} />
              </div>
            )}
            {this.state.shufflePlaylist && (
              <div className="MusicPlaylist_playbackButtonActive">
                <SwapOutlined onClick={this.toggleShufflePlaylist} />
              </div>
            )}
            {!this.state.shufflePlaylist && (
              <div className="MusicPlaylist_playbackButton">
                <SwapOutlined onClick={this.toggleShufflePlaylist} />
              </div>
            )}
          </div>
          <div style={{ float: "right" }}>
            <a
              href="https://github.com/neil-solomon/csc212-music-playlist"
              title="Github"
              target="blank"
            >
              <div style={{ color: "rgb(100,100,100)" }}>
                <GithubFilled className="MusicPlaylist_githubIcon" />
              </div>
            </a>
          </div>
          <div
            onClick={this.openAddVideosModal}
            className="MusicPlaylist_addVideosButton"
          >
            Add Videos
          </div>
        </div>
        <div
          className="MusicPlaylist_mainContainer"
          style={{ width: this.state.videoSize[1] }}
        >
          {this.state.playlist.length > 0 && (
            <div
              key={
                "playlistVideo" +
                this.state.playlist[this.state.currentVideo].id
              }
              className="MusicPlaylist_videoPlayerContainer"
              id="MusicPlaylist_videoPlayerContainer"
            >
              <YouTube
                videoId={this.state.playlist[this.state.currentVideo].id}
                id="videoPlayer"
                className="MusicPlaylist_videoPlayer"
                onPlay={() => this.setState({ videoPlayerIsPaused: false })}
                onPause={() => this.setState({ videoPlayerIsPaused: true })}
                onEnd={() => this.changeCurrentVideo(1)}
                onError={this.playbackError}
                onReady={this.setVideoPlayerElement}
                opts={{
                  height: this.state.videoSize[0],
                  width: this.state.videoSize[1],
                  playerVars: {
                    autoplay: 1,
                    disablekb: 0,
                  },
                }}
              ></YouTube>
            </div>
          )}
        </div>
        <div
          className="MusicPlaylist_playlist"
          key={"playlistContainer" + this.state.currentVideo}
          style={{ width: window.innerWidth - this.state.videoSize[1] - 2.5 }}
        >
          {this.state.playlist.length > 0 && (
            <div
              className="MusicPlaylist_playlistDescription"
              style={{
                width: window.innerWidth - this.state.videoSize[1] - 2.5,
              }}
            >
              {this.state.currentVideo > 0 && !this.state.shufflePlaylist && (
                <>
                  <div className="MusicPlaylist_playlistPrevious">Previous</div>
                  <strong>
                    {this.cleanString(
                      this.state.playlist[this.state.currentVideo - 1].title
                    )}
                  </strong>
                  <br></br>
                </>
              )}
              <div className="MusicPlaylist_playlistNow">Now playing</div>
              <strong>
                {this.cleanString(
                  this.state.playlist[this.state.currentVideo].title
                )}
              </strong>
              <br></br>
              {this.state.playlist[this.state.currentVideo].description}
              <br></br>
              {(this.state.currentVideo < this.state.playlist.length - 1 ||
                this.state.repeatPlaylist) &&
                !this.state.shufflePlaylist && (
                  <div className="MusicPlaylist_playlistNext">Up Next...</div>
                )}
              {this.state.shufflePlaylist && (
                <div className="MusicPlaylist_playlistNext">Shuffling...</div>
              )}
            </div>
          )}
          {this.state.playlist
            .slice(this.state.currentVideo + 1)
            .map((video, index) => (
              <div
                key={"playlistItem1" + video.id}
                className="MusicPlaylist_playlistItem"
              >
                <div className="MusicPlaylist_playlistItemButtons">
                  <div
                    className="MusicPlaylist_playlistItemButton"
                    onClick={() => this.movePlaylistItem(video.id, -1)}
                  >
                    <ArrowUpOutlined />
                  </div>
                  <div
                    className="MusicPlaylist_playlistItemButton"
                    onClick={() => this.movePlaylistItem(video.id, 1)}
                  >
                    <ArrowDownOutlined />
                  </div>
                  <div
                    className="MusicPlaylist_playlistItemButton"
                    onClick={() => this.removePlaylistItem(video.id)}
                  >
                    <CloseCircleOutlined />
                  </div>
                </div>
                <div
                  className="MusicPlaylist_playlistImage"
                  onClick={() => this.swapCurrentVideo(video.id)}
                >
                  <img
                    width={window.innerWidth - this.state.videoSize[1] - 22.5}
                    src={video.thumbnails.medium.url}
                    alt={video.title}
                  ></img>
                </div>
                <div>{this.cleanString(video.title)}</div>
              </div>
            ))}
          {(this.state.repeatPlaylist || this.state.shufflePlaylist) && (
            <>
              {this.state.playlist
                .slice(0, this.state.currentVideo)
                .map((video, index) => (
                  <div
                    key={"playlistItem2" + video.id}
                    className="MusicPlaylist_playlistItem"
                  >
                    <div className="MusicPlaylist_playlistItemButtons">
                      <div
                        className="MusicPlaylist_playlistItemButton"
                        onClick={() => this.movePlaylistItem(video.id, -1)}
                      >
                        <ArrowUpOutlined />
                      </div>
                      <div
                        className="MusicPlaylist_playlistItemButton"
                        onClick={() => this.movePlaylistItem(video.id, 1)}
                      >
                        <ArrowDownOutlined />
                      </div>
                      <div
                        className="MusicPlaylist_playlistItemButton"
                        onClick={() => this.removePlaylistItem(video.id)}
                      >
                        <CloseCircleOutlined />
                      </div>
                    </div>
                    <div
                      className="MusicPlaylist_playlistImage"
                      onClick={() => this.swapCurrentVideo(video.id)}
                    >
                      <img
                        width={
                          window.innerWidth - this.state.videoSize[1] - 22.5
                        }
                        src={video.thumbnails.medium.url}
                        alt={video.title}
                      ></img>
                    </div>
                    <div>{this.cleanString(video.title)}</div>
                  </div>
                ))}
            </>
          )}
          <div style={{ height: 50 }}></div>
        </div>
        <div className="MusicPlaylist_footer">
          <div className="MusicPlaylist_credits">
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/alfredo-hernandez"
              title="Alfredo Hernandez"
              target="blank"
            >
              Alfredo Hernandez
            </a>{" "}
            and{" "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              {" "}
              www.flaticon.com
            </a>
            . Additional components by{" "}
            <a href="https://ant.design/" title="Ant Design" target="blank">
              Ant Design
            </a>
            . Youtube data provided by{" "}
            <a
              href="https://developers.google.com/youtube/v3"
              title="Youtube Data API"
              target="blank"
            >
              YouTube Data API
            </a>{" "}
            using{" "}
            <a
              href="https://www.npmjs.com/package/youtube-search"
              title="youtube-search"
              target="blank"
            >
              {" "}
              youtube-search
            </a>
            . YouTube playback provided by{" "}
            <a
              href="https://developers.google.com/youtube/iframe_api_reference"
              title="YouTube IFrame Player API"
              target="blank"
            >
              YouTube IFrame Player API
            </a>{" "}
            using{" "}
            <a
              href="https://www.npmjs.com/package/react-youtube"
              title="react-youtube"
              target="blank"
            >
              {" "}
              react-youtube
            </a>
            . Project bootstrapped with{" "}
            <a
              href="https://reactjs.org/docs/create-a-new-react-app.html#create-react-app"
              title="create-react-app"
              target="blank"
            >
              create-react-app
            </a>
            .
          </div>
        </div>
        <MyModal
          visible={this.state.addVideosModalVisible}
          onClose={() => this.setState({ addVideosModalVisible: false })}
          onConfirm={() => this.setState({ addVideosModalVisible: false })}
          confirmText="Ok"
          width="80vw"
          title="Add Videos"
          divider={true}
          header={
            <div className="MusicPlaylist_searchContainer">
              <input
                type="text"
                placeholder="Search"
                id="searchInput"
                className="MusicPlaylist_searchInput"
              ></input>
              <SearchIcon
                className="MusicPlaylist_SearchIcon"
                onClick={this.search}
              />
            </div>
          }
          footer={
            <div style={{ textAlign: "center", padding: 5 }}>
              <div
                className="MusicPlaylist_modalOkButton"
                onClick={() => this.setState({ addVideosModalVisible: false })}
              >
                OK
              </div>
            </div>
          }
        >
          <div className="MusicPlaylist_searchResults">
            {this.state.searchResults.map((video, index) => (
              <div
                key={"searchResult" + video.id}
                className="MusicPlaylist_searchResult"
                onClick={() => this.addToPlaylist(index)}
              >
                <img
                  width={0.3 * window.innerWidth}
                  src={video.thumbnails.medium.url}
                  alt={video.title}
                ></img>
                <div>{this.cleanString(video.title)}</div>
              </div>
            ))}
          </div>
        </MyModal>
      </div>
    );
  }
}
