import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";
import { Container, Card, CardHeader, CardBody, CardText, CardFooter, CardImg, CardTitle, Button, } from "reactstrap";
import illustration from '../../images/laboratory-analyst.svg' // from manypixels.co


function Landing() {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (loading) {
    return '';
  }

  if (isAuthenticated) {
    return <Redirect to="dashboard" />
  }

  return (
    <Container style={{ display: 'flex', justifyContent: 'center' }} >
      <Card className="text-center" style={{ marginTop: '50px', width: '400px' }}>
        <CardHeader style={{ fontSize: '20px' }}>
          {/* Welcome! */}
          Welcome to the OpenAg Education UI
        </CardHeader>
        <CardBody>
          <CardTitle>
          </CardTitle>
          <CardImg top style={{ width: '280px', marginBottom: '10px' }} src={illustration} alt="Card image cap" />
          <CardText style={{ margin: 20 }}>
            Connect a device, start a recipe, and view your data.
            Create an account to get started.
          </CardText>
          <Button onClick={() => loginWithRedirect()}>Create Account</Button>
        </CardBody>
        <CardFooter className="text-muted">
          <span style={{ flexDirection: 'row' }}>
            Or, check out the <a style={{ display: "table-cell" }} href="https://forum.openag.media.mit.edu" rel="noopener noreferrer" target="_blank">forum</a>.
          </span>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default Landing;