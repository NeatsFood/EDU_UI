import React from "react";
import { Container, ListGroup, ListGroupItem } from 'reactstrap';


export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: {},
    };
  }

  render() {
    const { currentData } = this.props;
    const notes = currentData.plantNotes || [];
    console.log('notes:', notes);

    return (
      <Container fluid style={{ padding: 15 }}>
        {notes.length < 1 ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            No Notes
          </div>
        ) : (
            <ListGroup>
              {
                notes.map((note) => {
                  return (
                  <ListGroupItem key={note.date.getTime()}><b>{note.date.toLocaleString("en-US", {
                    month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
                  })}:</b> {note.value}</ListGroupItem>
                )})
              }
            </ListGroup>
          )
        }
      </Container >
    )
  }
}