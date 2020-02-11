import React, {useEffect, useReducer, useState} from 'react';
import {Container, Row, Col} from 'reactstrap';
import SimpleClusterList from "./SimpleClusterList";
import getUserCluster from "../../services/getUserCluster";

function Cluster(props) {
    const {user} = props;
    const [data, setData] = useState({devices: [], refreshing: false});
    //const [forceRefresh,setForceRefresh] = useReducer((s,x) => {s = x; return s;}, false);
    //const [initilaized, setInitlalized] = useState(false);
    const [forceRefresh,setForceRefresh] = useReducer((s) => {return s + 1},0);

    useEffect(() => {
        const fetchCluster = async () => {
            try {
                setData({devices: [], refreshing: true});
                const response = await getUserCluster(user.token);
                setData({devices: response, refreshing: false});
            } catch(e) {
                console.log(e);
                setData({devices: [], refreshing: false});
            }
        };
        //if(forceRefresh) {
        //    setForceRefresh(false); // sets it to false.
            fetchCluster();
    }, [forceRefresh]);

    return (
        <Container fluid>
            <Row>
                <Col xs={12} sm={4}>
                    <SimpleClusterList handleRefresh={() => {setForceRefresh();}} refreshing={data.refreshing} devices={data.devices}/>
                </Col>
            </Row>
        </Container>
    )
};

export default Cluster

// -- OLD NON HOOK VERSION
/*
import React from 'react';

import getUserCluster from "../../services/getUserCluster";
import {withCookies} from "react-cookie";
import {Card, CardBody, CardSubtitle, CardText, CardTitle, Button} from "reactstrap";
import {DeviceCard} from "./DeviceCard";

class Cluster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            refreshing: true,
        };
        this.loadCluster = this.loadCluster.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        console.log("In componentDidMount");
        //const {initialized} = this.props.pfcs.length > 0 || this.state.initialized;
        const {user, clusterLoaded} = this.props;

        console.log("clusterLoaded: " + clusterLoaded);
        console.log("User: " + user.token)
        if (!clusterLoaded && user && user.token) {
            this.props.setClusterLoaded("true"); // don't want to trigger a second load in Update
            this.setState({initialized: true});
            console.log("componentDidMount about to call loadCluster");
            this.loadCluster();
        }
    }

    componentDidUpdate() {
        console.log("In componentDidUpdate");
        //const {initialized} = this.props.pfcs.length > 0 || this.state.initialized;
        const {user, clusterLoaded} = this.props;
        const {initialized} = this.state;
        console.log("clusterLoadedAndInit: " + (!clusterLoaded && initialized));
        if (!clusterLoaded && initialized && user && user.token) {
            this.loadCluster();
        }
    }

    loadCluster() {
        console.log("In load Cluster");
        const {user} = this.props;
        this.props.setClusterLoaded(true); // here to prevent double loading in Update
        getUserCluster(user.token).then(loadedDevices => {
            this.props.setPfcs(loadedDevices);
            if (this.state.refreshing){
                this.setState({refreshing:false});
            }
        });
    }

    handleRefresh(){
        this.setState({refreshing: true});
        this.props.setPfcs([]);
        this.props.setClusterLoaded(false);
    }

    render() {
        const pfcs = this.props.pfcs || [];
        const clusterLoaded = this.props.clusterLoaded;
        const refreshing = this.state.refreshing;

            return (
                <div>
                    <h1>Device List <RefreshButton onClick={this.handleRefresh} refreshing={refreshing}/></h1>
                    {pfcs.map((device) => {
                        return (
                            <DeviceCard device={device} key={device.uuid}/>
                        );
                    })}
                </div>
            );
    }
}

export default withCookies(Cluster);
*/