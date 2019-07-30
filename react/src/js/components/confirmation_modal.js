import React from 'react';
import {
    Button,
    Form,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

const DEFAULT_STATE = {
    data_to_submit: ''
};

/**
 * ConfirmationModal
 *
 * props
 * - isOpen (bool): Whether modal is open.
 * - toggle (function): Callback for opening and closing the modal.
 * - onSubmit (function): Callback for form submission. Will be called
 *                        with the state, which contains the form responses.
 *
 * - data_to_submit (string): data that gets sent with the onSubmit() call.
 * - dialog_title (string): 'Confirm Delete of User',
 * - dialog_message (string): 'Are you sure you want to delete user blah?',
 * - form_submission_button_text (string): 'Delete',
 * - cancel_button_text (string): 'Cancel'
 * - error_message (string): Error message to be displayed.
 */
export class ConfirmationModal extends React.PureComponent {

    state = DEFAULT_STATE;

    onSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    // Clears any input before closing
    toggle = () => {
        this.setState(DEFAULT_STATE);
        this.props.toggle();
    }

    render() {
        // we must use the property set externally to update the state
        this.setState({data_to_submit: this.props.data_to_submit});
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.toggle}
                className={this.props.className}
            >
                <ModalHeader toggle={this.toggle}>
                    {this.props.dialog_title}
                </ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
                        {this.props.error_message &&
                            <p style={{color: 'red'}}>
                                {this.props.error_message}
                            </p>
                        }
                        {this.props.dialog_message}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" type="submit">
                            {this.props.form_submission_button_text}
                        </Button>
                        <Button color="secondary" onClick={this.toggle}>
                            {this.props.cancel_button_text}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
}
