import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";

export function RecipeSelector(props) {
    const {recipes, startButtonHandler} = props;
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState("");
    const [recipesByUUID, setRecipesByUUID] = useState(new Map());

    // Figure out if we're loading or not
    useEffect(() => {
        const propsRecipes = recipes || {};
        if (recipesLoading && propsRecipes.example && propsRecipes.user) {
            setRecipesLoading(false);
            let tempRecipes = new Map();
            if (propsRecipes.example) {
                propsRecipes.example.forEach((e, key) => {
                    tempRecipes.set(e.recipe_uuid, e);
                });
            }
            if (propsRecipes.user) {
                propsRecipes.user.forEach((e, key) => {
                    tempRecipes.set(e.recipe_uuid, e);
                });
            }
            setRecipesByUUID(tempRecipes);
            setSelectedRecipe(propsRecipes.example[0].recipe_uuid);
        }
    }, [recipes]);

    const changeRecipe = (event) => {
        setSelectedRecipe(event.target.value);
    };

    if (recipesLoading) {
        return (
            <h6>Fetching Recipes...</h6>
        )
    } else {

        return (
            <div>
                <InputGroup>
                    <InputGroupAddon addonType={"prepend"}>
                        <InputGroupText>Recipe To Run</InputGroupText>
                    </InputGroupAddon>
                    <Input name={"selectedRecipe"} type={"select"} onChange={changeRecipe}>
                        <option disabled={true}>-- System Recipes --</option>
                        {props.recipes.example.map((e, key) => {
                            return <option key={key} value={e.recipe_uuid}
                                           selected={e.recipe_uuid === selectedRecipe}>{e.name}</option>;
                        })}
                        <option disabled={true}>-- User Recipes --</option>
                        {props.recipes.user.map((e, key) => {
                            return <option key={key} value={e.recipe_uuid}>{e.name}</option>;
                        })}
                    </Input>
                </InputGroup>
                <Card className={"mt-2"}>
                    <CardBody>
                        <CardTitle><h5>{recipesByUUID.get(selectedRecipe).name}</h5></CardTitle>
                        <CardSubtitle><h6 className={"text-muted"}>{recipesByUUID.get(selectedRecipe).recipe_uuid}</h6>
                        </CardSubtitle>
                        <CardText>{recipesByUUID.get(selectedRecipe).recipe_json.description.brief}<br/>
                            <small
                                className={"text-muted"}>Created {recipesByUUID.get(selectedRecipe).recipe_json.creation_timestamp_utc}</small></CardText>
                    </CardBody>
                </Card>
                <br/>
                <Button onClick={() => {if(startButtonHandler) {
                    startButtonHandler(selectedRecipe)
                }}}>Start "{recipesByUUID.get(selectedRecipe).name}" On Selected Devices</Button>
            </div>
        )
    }
}