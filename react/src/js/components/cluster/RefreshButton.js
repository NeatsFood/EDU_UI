import React from 'react';
import {Button} from "reactstrap";

const RefreshButton = (props) => {
    if (props.refreshing){
        return <Button outline size={"sm"} disabled={true}>Loading...</Button>
    } else {
        return <Button outline size={"sm"} onClick={props.onClick}>Refresh List</Button>
    }
};

export default RefreshButton