import React, {useEffect, useReducer, useState} from 'react';
import {Container, Row, Col} from 'reactstrap';
import SimpleClusterList from "./SimpleClusterList";
import getUserCluster from "../../services/getUserCluster";
import {RecipeSelector} from "./RecipeSelector";
import stopRecipe from "../../services/stopRecipe";

function Cluster(props) {
    const {user} = props;
    const [data, setData] = useState({devices: [], refreshing: false});
    const [selectedDevices, setSelectedDevices] = useState(new Set([]));

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
        fetchCluster();
    }, [forceRefresh]);

    const startRecipeHandler = recipe_uuid => {
        if (selectedDevices.size <= 0){
            alert("No devices selected");
        } else {
            alert("Attempting to start " + recipe_uuid + " on " + JSON.stringify(Array.from(selectedDevices)));
        }
    };

    const stopRecipeHandler = (device_uuid) => {
        //alert("Attempting to stop recpie on deivce: " + device_uuid);
        stopRecipe(user.token, device_uuid);
    };

    return (
        <Container fluid>
            <Row>
                <Col xs={12} sm={6}>
                    <SimpleClusterList handleRefresh={() => {setForceRefresh();}}
                                       refreshing={data.refreshing}
                                       devices={data.devices}
                                       stopHandler={stopRecipeHandler}
                                       selectedDevices={selectedDevices}
                                       setSelectedDevices={setSelectedDevices}/>
                </Col>
                <Col sm={6} className={"p-2"}>
                    <h4>Run Recipe on Selected Devices</h4>
                    <RecipeSelector recipes={props.recipes} startButtonHandler={startRecipeHandler}/>
                </Col>
            </Row>
        </Container>
    )
}

export default Cluster