import React, {useState} from 'react';
import {Input} from 'reactstrap';
import {CompactDeviceCard, DeviceCard} from "./DeviceCard";
import RefreshButton from "./RefreshButton";


const SimpleClusterList = (props) => {
    const [filterOnline, setFilterOnline] = useState(false);
    const [filterAvailable, setFilterAvailable] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState(new Set([]));
    const [compact, setCompact] = useState(true);

    function clickDevice(deviceUUID){
        if (selectedDevices.has(deviceUUID)){

        }
    }
    return (
        <div>
            <h1>Device List <RefreshButton onClick={props.handleRefresh} refreshing={props.refreshing}/></h1>
            <p><div className={"ml-5"}><Input
                type="checkbox"
                checked={filterOnline}
                onChange={e => setFilterOnline(!filterOnline)}
            />Show only online devices</div>
            <div className={"ml-5"}><Input
                type="checkbox"
                checked={filterAvailable}
                onChange={e => setFilterAvailable(!filterAvailable)}
            />Show only available devices</div></p>
            {props.devices.map((device) => {
                if((!filterOnline || (device.connected)) &&
                    (!filterAvailable || device.available)){
                    if(compact) {
                        return (
                            <CompactDeviceCard device={device} key={device.uuid}/>
                        );
                    } else {
                        return (
                            <DeviceCard device={device} key={device.uuid}/>
                        );
                    }
                }
            })}
        </div>
    );
}

export default SimpleClusterList