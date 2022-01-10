import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Redirect} from "react-router-dom";
import HOST from "../constants/host";
import check_expired from "../utils/useToken";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };
  

export default function CustomDialog({
  open,
  handleClose,
  handleClickOpen,
  title,
  isbn
}) {

    const [items,setItems]=useState([]);
    var token=localStorage.getItem("token");

  function getBooksByisbn(isbn) {
        if (!localStorage.getItem("token")) {
          return <Redirect to="/login" />;
        } else {
          if (check_expired()) {
            return <Redirect to="/login" />;
          }
        }
    
        fetch(HOST() + "/books/"+isbn+"?verbose=true", {
          method: "GET",
          headers: {
            'Authorization': token,
            'Content-type': 'application/json',
          },
        })
          .then((data) => {
            if (data.ok) {
              data.json().then((message)=>{
                setItems(message);
              });
            }
            else if (data.status === 404) {
              setItems([]);
            } else {
              throw new Error("Internal server error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      function clickOpen()
      {
        getBooksByisbn(isbn)
        handleClickOpen();
      }

  return (
    <div>
      <Button variant="outlined" onClick={clickOpen}>
        {title}
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            ISBN:{items["isbn"]}
          </Typography>
          <Typography gutterBottom>
            Titlu:{items["titlu"]}
          </Typography>
          <Typography gutterBottom>
            Editura:{items["editura"]}
          </Typography>
          <Typography gutterBottom>
            An publicare:{items["anpublicare"]}
          </Typography>
          <Typography gutterBottom>
            Gen literar:{items["genliterar"]}
          </Typography>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
