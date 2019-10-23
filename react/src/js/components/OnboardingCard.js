import React from 'react';
import { Card, CardHeader, CardBody, CardText, CardFooter, CardTitle } from "reactstrap";

export default class OnboardingCard extends React.Component {
  render() {
    const { title, illustration, instruction, footer } = this.props;

    return (
      <Card className="text-center" style={{ marginTop: '50px', width: '400px' }}>
        <CardHeader style={{ fontSize: '20px' }}>
          {title}
        </CardHeader>
        <CardBody>
          <CardTitle>
          </CardTitle>
          {illustration}
          <CardText style={{ margin: 20, marginBottom: 10 }}>
            {instruction}
          </CardText>
        </CardBody>
        <CardFooter className="text-muted">
          {footer}
        </CardFooter>
      </Card>
    )
  }
}