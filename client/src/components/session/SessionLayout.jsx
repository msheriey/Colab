import React, {Component} from 'react';
import {Col} from "react-bootstrap";

import Form from "react-bootstrap/Form";
import Draggable from 'react-draggable';

import AceEditor from 'react-ace';

// REVIEW: Remove useless imports
import 'brace/mode/java';
import 'brace/mode/c_cpp';

import 'brace/theme/github';
import 'brace/theme/tomorrow';

import '../../css/index.css';

class SessionLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: this.props.rooms,
            resizing: false,
            CodeSectionHeight: 70,
            OutputSectionHeight: 29.01,
            editor: ""
        };
    }

    // REVIEW: Commented code was removed from here

    handling = (e) => {
        this.setState({editor: e},() => {
                this.props.handler(this.state.editor);
            }
        );
    };

    joinRoom = (event) => {
        this.state.socket.emit("joinRoom", event);
    };

    send = (event) => {
        this.state.socket.emit("sharedCode", event.target.id, event.target.value);
    };

    getDimensions = (el) => {
        let rect = el.getBoundingClientRect();
        return {height: rect.height, y: rect.top};
    };

    resize = (e) => {
        e.stopPropagation();
        e.preventDefault();

        let div = this.getDimensions(document.querySelector(".wrapper"));

        let newHeight = Math.max(Math.min((e.clientY - div.y) / div.height * 100, 96), 4);

        this.setState({
            CodeSectionHeight: newHeight,
            OutputSectionHeight: 99.01 - newHeight - 0.01
        });
    };

    render() {

        // REVIEW: The usage of rooms in here is ?
        const {rooms} = this.state;
        return (
            <Col xs={9}>
                <div className={"codingSection"}>
                    <div className={"content"} style={{height:this.state.CodeSectionHeight+"%"}}>
                        <AceEditor
                            value={this.state.editor}
                            onChange={this.handling}
                            fontSize={"16px"}
                            mode="c_cpp"
                            width={"100%"}
                            height={"100%"}
                            theme="tomorrow"
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{$blockScrolling: true}}
                        />
                    </div>

                    <Draggable
                        axis="y"
                        onDrag={(e) => this.resize(e)}
                        scale={0}
                        bounds={{bottom: 10}}
                    >
                        <div className={"handle"}/>
                    </Draggable>

                    <div className={"content"} style={{height: this.state.OutputSectionHeight + "%"}}>
                        <Form.Control
                            as={"textarea"}
                            style={{resize: "none", height:"100%", borderRadius: 0}}
                            placeholder={"Output Section ..."}
                        />
                    </div>
                </div>
            </Col>
        );
    }
}

export default SessionLayout;