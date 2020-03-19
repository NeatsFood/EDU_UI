import React, {useState} from 'react';
import {Input, Row, Col, Container, Button} from 'reactstrap';
import {CompactDeviceCard, DeviceCard} from "./DeviceCard";
import RefreshButton from "./RefreshButton";

const SimpleClusterList = (props) => {
    // the list of selected devices is in the parent so it can handle the starting and stopping of recipes
    const {selectedDevices, setSelectedDevices} = props;
    const [filterOnline, setFilterOnline] = useState(false);
    const [filterAvailable, setFilterAvailable] = useState(false);
    const [expandedDevices, setExpandedDevices] = useState(new Set([]));

    const clickSelectedHandler = device_uuid => {
        if(device_uuid){
            let newSelectedDevices = new Set(selectedDevices);
            if (!selectedDevices.has(device_uuid)){
                newSelectedDevices.add(device_uuid);
            } else {
                newSelectedDevices.delete(device_uuid);
            }
            setSelectedDevices(newSelectedDevices);
        }
    };

    const clickForInfoHandler = device_uuid => {
        if(device_uuid){
            let newExpandedDevices = new Set(expandedDevices);
            if (!expandedDevices.has(device_uuid)){
                newExpandedDevices.add(device_uuid);
            } else {
                newExpandedDevices.delete(device_uuid);
            }
            setExpandedDevices(newExpandedDevices);
        }
    };

    const collapseAll = () => {
        setExpandedDevices(new Set([]));
    };

    const expandAll = () => {
        let newExpandedDevices = new Set([]);
        props.devices.forEach((device) => {newExpandedDevices.add(device.uuid);});
        setExpandedDevices(newExpandedDevices);
    };

    const echoSelected = () => {
        if(selectedDevices.size < 1){
            alert("No devices selected");
        } else {
            alert(Array.from(selectedDevices).join(", "));
        }
    };

    // ** Return info if no devices passed in
    if(props.devices.length < 1 && !props.refreshing){
        return(
            <Container fluid>
                <Row className={"align-items-center"}>
                    <Col sm={4}>
                        <h1>Device List</h1>
                    </Col>
                    <Col sm={2} ><h2 className={"align-bottom"}><RefreshButton onClick={props.handleRefresh} refreshing={props.refreshing}/></h2></Col>
                </Row>
                <Row>
                        <Col sm={{offset:1}}>
                            No Devices.
                        </Col>
                </Row>
            </Container>
        )
    }

    if(props.devices.length < 1 && props.refreshing){
        return(
            <Container fluid>
                <Row className={"align-items-center"}>
                    <Col sm={4}>
                        <h1>Device List</h1>
                    </Col>
                    <Col sm={2} ><h2 className={"align-bottom"}><RefreshButton onClick={props.handleRefresh} refreshing={props.refreshing}/></h2></Col>
                </Row>
                <Row>
                    <Col sm={{offset:1}}>
                        Loading Devices...
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container fluid>
            <Row>
                <Col sm={4}>
                    <h1 onClick={echoSelected}>Device List</h1>
                </Col>
                <Col sm={2} ><h2 className={"align-bottom"}><RefreshButton onClick={props.handleRefresh} refreshing={props.refreshing}/></h2></Col>
                <Col sm={4} ><h2 className={"align-bottom"}><Button outline size={"sm"} onClick={expandAll}>Expand All</Button> <Button outline size={"sm"} onClick={collapseAll}>Collapse All</Button></h2></Col>
            </Row>
            <Row>
                <Col sm={{size:4,offset:1}}>
                    <Input
                    type="checkbox"
                    checked={filterOnline}
                    onChange={e => setFilterOnline(!filterOnline)}
                />Show only online devices
                </Col>
                <Col sm={4}>
                    <Input
                        type="checkbox"
                        checked={filterAvailable}
                        onChange={e => setFilterAvailable(!filterAvailable)}
                    />Show only available devices
                </Col>
            </Row>

            {props.devices.map((device) => {
                const compact = !expandedDevices.has(device.uuid);
                const selected = selectedDevices.has(device.uuid);
                console.log(compact);
                if((!filterOnline || (device.connected)) &&
                    (!filterAvailable || device.available)){
                    if(compact) {
                        return (
                            <CompactDeviceCard device={device}
                                               key={device.uuid}
                                               selected={selected}
                                               clickExpandHandler={clickForInfoHandler}
                                               clickSelectedHandler={clickSelectedHandler}/>
                        );
                    } else {
                        return (
                            <DeviceCard device={device}
                                        key={device.uuid}
                                        selected={selected}
                                        clickExpandHandler={clickForInfoHandler}
                                        clickSelectedHandler={clickSelectedHandler}
                                        stopHandler={props.stopHandler}/>
                        );
                    }
                }
            })}
        </Container>
    );
};

export default SimpleClusterList