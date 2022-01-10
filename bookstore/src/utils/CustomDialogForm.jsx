import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react";
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
import { Redirect } from "react-router-dom";
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

export default function CustomDialogForm({
    open,
    handleClose,
    handleClickOpen,
}) {
    const [items, setItems] = useState([]);
    var token = localStorage.getItem("token");

    function addBooks(isbn, titlu, editura, anpublicare, genliterar, stock, price) {
        if (!localStorage.getItem("token")) {
            return <Redirect to="/login" />;
        } else {
            if (check_expired()) {
                return <Redirect to="/login" />;
            }
        }

        fetch(HOST() + "/books/", {
            method: "POST",
            headers: {
                'Authorization': token,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ isbn, titlu, editura, anpublicare, genliterar, stock, price }),
        })
            .then((data) => {
                if (data.ok) {
                    data.json().then((message) => {
                        console.log(message);
                    });
                }
                else if (data.status === 404) {
                    console.log(data);
                }
                else if (data.status === 403) {
                    localStorage.removeItem("token");
                }
                else {
                    throw new Error("Internal server error");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function clickOpen() {
        handleClickOpen();
    }

    return (
        <div>
            <Button variant="outlined" onClick={clickOpen}>
                Add book
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add book
                </BootstrapDialogTitle>
                <DialogContent dividers>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Add Book</Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
