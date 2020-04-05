import React from "react";
import { GithubFilled } from "@ant-design/icons";

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="credits">
          Youtube icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/alfredo-hernandez"
            title="Alfredo Hernandez"
          >
            Alfredo Hernandez
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            {" "}
            www.flaticon.com.
          </a>{" "}
          Github icon made by <a href="https://ant.design/">Ant Design</a>.
          Youtube data provided by{" "}
          <a href="https://developers.google.com/youtube/v3">
            Youtube Data API
          </a>{" "}
          via{" "}
          <a href="https://www.npmjs.com/package/youtube-search">
            {" "}
            youtube-search
          </a>
          .
        </div>
        <GithubFilled className="githubIcon"></GithubFilled>
      </div>
    );
  }
}
