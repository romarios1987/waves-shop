import React from 'react';
import {Link} from "react-router-dom";

const CustomButton = ({type, title, linkTo, addStyles}) => {

    const buttons = () => {
        let template_button = '';


        switch (type) {
            case "default":
                template_button = <Link
                    className="link_default"
                    to={linkTo}
                    {...addStyles}
                >
                    {title}
                </Link>;
                break;
            default:
                template_button = ''
        }

        return template_button;


    };

    return (
        <div className="my_link">
            {buttons()}
        </div>
    );
};

export default CustomButton;