import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import PortfolioApi from '../../Api/api';

const DeletePortfolioModal = ({ id, showModal, handleClose }) => {
  const { currentUser, refresh } = useAuth();
  const { push } = useNavigate();

  const handleDelete = async () => {
    let res = await PortfolioApi.deletePortfolio(id);
    if (res === Number(id)) {
      refresh(currentUser.username);
      push('/home');
    }
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>Deleting portfolio is permanent! Are you sure you want to continue?</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeletePortfolioModal
