import React from "react";
import { IconButton } from "@mui/material";

export const TogleButton = ({label, onClick, style, innerIcon}) => {
    return(
        <IconButton aria-label={label}  size='large' onClick={onClick} sx={style}>
            {innerIcon}
        </IconButton>
    );
}