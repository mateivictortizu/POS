import React from "react";
import CustomDialogFromAutor from "../../utils/CustomDialogFormAutor";

export default function AutorAdd() {

    document.title = "BookStore - Autor";

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className="wrapper">
            <CustomDialogFromAutor
                open={open}
                handleClickOpen={handleClickOpen}
                handleClose={handleClose}
            />
        </div>
    );
}