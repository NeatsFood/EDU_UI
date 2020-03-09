import React from 'react';

import {Media,
        Badge,
        Row,
        Col,
        Input,
        Button,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareRight, faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

export function DeviceCard(props) {
    let device = props.device;
    const connectedClass = device.connected ? "border border-success" : "border border-danger";
    const dislayRecipe = device.currentRecipe ? device.currentRecipe.replace("@", " ") : "";
    const infoExpand = () => {props.clickExpandHandler(device.uuid)};
    const handleStop = (e) => {
        e.preventDefault();
        const uuid = e.target.getAttribute("deviceUUID");
        const name = e.target.getAttribute("deviceName");
        if(window.confirm("Are you sure you want to stop the recipe running on "+name) ) {
            props.stopHandler(uuid);
            alert("Stopping Recipe running on " + uuid);
        }
    };

    return (
        <Media className={"m-1 p-2 " + connectedClass}>

            <Media body left>
                <Media heading>
                    <FontAwesomeIcon icon={faCaretSquareDown} className={"mr1"} onClick={infoExpand}/> {device.friendlyName}
                </Media>
                <Badge className="mr-1"
                       color={device.connected ? "success" : "danger"}>{device.connected ? "Connected" : "Disconnected"}</Badge>
                <Badge
                    color={device.available ? "success" : "primary"}>{device.available ? "Available" : "In Use"}</Badge>

                <div className={"ml-4"}>
                    { !device.available &&
                        <span>
                        <b>Current Recipe</b>: {dislayRecipe}<br/>
                        <b>Recipe Start Time</b>: {device.recipeStart} <Badge href={"#"} color={"danger"} deviceName={device.friendlyName} deviceUUID={device.uuid} onClick={handleStop}><FontAwesomeIcon icon={faTimesCircle} size={"xs"}/> Stop Recipe</Badge><br/>
                        </span>
                    }
                    <b>Current Temperature</b>: {device.currentTemp}<br/>
                    <b>Last Status</b>: {device.statusTimestamp}<br/>
                    <Row><Col><b>Selected</b>: </Col><Col><Input type={"checkbox"} checked={props.selected} onChange={e => props.clickSelectedHandler(device.uuid)}/></Col></Row>
                </div>
            </Media>
            <Media className={"m-3"}>
                <Media object src={device.latestImageUrl}></Media>
            </Media>
        </Media>
    )
}

function convertMinsToFriendly(numMins){
    if (numMins < 60) {
        return Math.round(numMins) + " m";
    } else {
        const numHours = numMins / 60;
        if (numHours < 24) {
            return Math.round(numHours) + " h";
        } else {
            const numDays = numHours/24;
            if (numDays < 30){
                return Math.round(numDays) + " days";
            }
            return "over a month";
        }
    }
}

export function CompactDeviceCard(props){
    let device = props.device;
    const connectedClass = device.connected ? "border border-success" : "border border-danger";
    let lastSeen = "--";
    if (device.lastSeenMins) {
        lastSeen = convertMinsToFriendly(device.lastSeenMins) + " ago";
    }
    const infoExpand = () => {props.clickExpandHandler(device.uuid)};
    return (
        <Row className={connectedClass + " ml-1 mb-2"}>
            <Col sm={"4"}><small><FontAwesomeIcon icon={faCaretSquareRight} className={"mr-1"}  onClick={infoExpand}/> {device.friendlyName}</small></Col>
            <Col sm={"2"}><small><Badge className="mr-1"
                        color={device.connected ? "success" : "danger"}>{device.connected ? "Connected" : "Disconnected"}</Badge></small>
            </Col>
            <Col sm={"1"}><small><Badge
                color={device.available ? "success" : "primary"}>{device.available ? "Available" : "In Use"}</Badge></small>
            </Col>
            <Col><small>{lastSeen}</small></Col>
            <Col><Input type={"checkbox"} checked={props.selected} onChange={e => props.clickSelectedHandler(device.uuid)}/></Col>
        </Row>
    );
}

/*    return (
        <Card>
            <CardBody>
                <CardTitle><h4>{device.friendlyName}</h4></CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted">{device.wifiStatus} - {device.uuid}</CardSubtitle>
                <CardText>Current Recipe: {device.currentRecipe}<br/>
                    Recipe Start Time: {device.recipeStart}<br/>
                    Current Temperature: {device.currentTemp}<br/>
                    Last Status: {device.statusTimestamp}<br/>
                    Latest Image: <a href={device.latestImageUrl} target={"_blank"}><img
                        src={device.latestImageUrl}></img></a></CardText>
            </CardBody>
        </Card>
    );
    */
