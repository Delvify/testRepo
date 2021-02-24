import React, { useCallback } from "react";
// reactstrap components
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import PropTypes from "prop-types";

// core components

const ConfirmModal = (props) => {
    const { toggleModal, isOpen, heading, message, confirmLabel, onConfirm } = props;
    const confirmHandler = useCallback(() => {
        onConfirm();
        toggleModal();
    }, [toggleModal, onConfirm]);
    return (
        <>
            <Modal toggle={toggleModal} isOpen={isOpen} className="modal-xl">

              <ModalHeader toggle={toggleModal}>{ heading }</ModalHeader>
              { !!message && <ModalBody>{ message }</ModalBody> }
              <ModalFooter>
                  <Button type="button" onClick={toggleModal}>
                      Cancel
                  </Button>
                  <Button color="primary" onClick={confirmHandler}>
                      { confirmLabel }
                  </Button>
              </ModalFooter>
            </Modal>
        </>
    );
};


ConfirmModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    heading: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    confirmLabel: PropTypes.string,
};

ConfirmModal.defaultProps = {
    toggleModal: () => {},
    isOpen: false,
    heading: null,
    message: null,
    onConfirm: () => {},
    confirmLabel: "Confirm",
};

export default ConfirmModal;
