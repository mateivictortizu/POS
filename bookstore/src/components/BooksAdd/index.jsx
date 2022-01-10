import React from "react";
import "./BooksAdd.css";
import CustomDialogFrom from "../../utils/CustomDialogForm";

export default function BooksAdd() {

    document.title = "BookStore - Books";

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className="wrapper">
            <CustomDialogFrom
                open={open}
                handleClickOpen={handleClickOpen}
                handleClose={handleClose}
            />
        </div>
    );
}