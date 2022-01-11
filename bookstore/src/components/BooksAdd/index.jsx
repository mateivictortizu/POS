import React from "react";
import "./BooksAdd.css";
import CustomDialogFrom from "../../utils/CustomDialogForm";

export default function BooksAdd({
    isbn_param,
    titlu_param,
    editura_param,
    anpublicare_param,
    genliterar_param,
    stock_param,
    price_param,
    type
}) {

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
                isbn_param={isbn_param}
                titlu_param={titlu_param}
                editura_param={editura_param}
                anpublicare_param={anpublicare_param}
                genliterar_param={genliterar_param}
                stock_param={stock_param}
                price_param={price_param}
                type={type}
            />
        </div>
    );
}