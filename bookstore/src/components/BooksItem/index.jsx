import React from "react";
import "./BooksItem.css";
import CustomDialog from "../../utils/CustomDialog";

export default function BooksItem({
  isbn,
  title
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
      <CustomDialog
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        title={title}
        isbn={isbn}
      />
    </div>
  );
}
