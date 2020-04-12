/* 
Accepts props for:
visibility 'visible'
modal width 'width'
title text 'title',
styles for the title 'titleStyle',
callback function for cancel 'onClose'
callback function for confirm 'onConfirm',
custom text for cancel 'closeText'
custom text for confirm 'confirmText' buttons,
whether the scrollbar is visible on overflow 'scrollbarVisible',
visibility for the divider (under the title and above the footer) 'divider',
header content 'header',
footer content 'footer'
*/

import React from "react";
import { Button } from "antd";
import "./MyModal.css";

export default class MyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visble,
      className: "MyModal",
      hideModalTimeout: null,
    };
  }

  componentDidMount() {
    this.updateSize();
    window.addEventListener("resize", () => this.updateSize());
  }

  componentWillUnmount() {
    clearTimeout(this.state.hideModalTimeout);
    window.removeEventListener("resize", () => this.updateSize());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible && !this.props.visible) {
      var hideModalTimeout = setTimeout(() => this.hideModal(), 250);
      this.setState({ className: "MyModal_hide", hideModalTimeout });
    } else if (!prevProps.visible && this.props.visible) {
      this.setState({ visble: true });
    }
  }

  updateSize = () => {
    var containerLeft = "20vw",
      width = "60vw";
    if (this.props.width) {
      width = this.props.width;
      if (this.props.width[this.props.width.length - 1] === "w") {
        containerLeft =
          ((100 - parseInt(this.props.width)) / 2).toString() + "vw";
      } else {
        containerLeft =
          ((window.innerWidth - parseInt(this.props.width)) / 2).toString() +
          "px";
      }
    }
    this.setState({
      containerLeft: containerLeft,
      containerWidth: width,
    });
  };

  hideModal = () => {
    this.setState({ visble: false, className: "MyModal" });
  };

  render() {
    // if (this.state.visble) {
    //   document.body.style.overflowY = "hidden";
    //   document.body.style.position = "absolute";
    // } else {
    //   document.body.style.overflowY = "auto";
    //   document.body.style.position = "static";
    // }

    var contentWidth = "100%",
      contentMarginLeft = "0px",
      contentPadding = "20px";
    if (!this.props.scrollbarVisible) {
      contentWidth = "calc(100% + 30px)";
      contentMarginLeft = "-10px";
      contentPadding = "30px";
    }

    var confirmText = "Confirm";
    if (this.props.confirmText) {
      confirmText = this.props.confirmText;
    }

    var closeText = "Cancel";
    if (this.props.closeText) {
      closeText = this.props.closeText;
    }

    return (
      <>
        {this.state.visble && (
          <div className={this.state.className}>
            <div
              className="MyModal_overlay"
              style={{ height: window.innerHeight + window.scrollY }}
              onClick={this.props.onClose}
            ></div>
            <div
              className="MyModal_container"
              style={{
                width: this.state.containerWidth,
                left: this.state.containerLeft,
                top: 0.025 * window.innerHeight + window.scrollY,
              }}
            >
              {this.props.header && this.props.header}
              {!this.props.header && (
                <h1 className="MyModal_header" style={this.props.titleStyle}>
                  {this.props.title}
                </h1>
              )}
              {this.props.divider && <div className="MyModal_divider"></div>}
              <div
                className="MyModal_content"
                style={{
                  width: contentWidth,
                  marginLeft: contentMarginLeft,
                  padding: contentPadding,
                }}
              >
                {this.state.visble && this.props.children}
              </div>
              {this.props.divider && <div className="MyModal_divider"></div>}
              {this.props.footer && this.props.footer}
              {!this.props.footer && (
                <div className="MyModal_footer">
                  <Button onClick={this.props.onClose}>{closeText}</Button>
                  <div style={{ width: 20, display: "inline-block" }}></div>
                  <Button onClick={this.props.onConfirm} type="primary">
                    {confirmText}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
