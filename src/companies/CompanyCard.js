import React from "react";
import { Link } from "react-router-dom"

import "./CompanyCard.css"

function CompanyCard({ name, description, logoUrl, handle }) {
    console.debug("CompanyCard", logoUrl);

    return (
        <Link to={`/companies/${handle}`}>
            <h6>{name}
            {logoUrl && <img src={logoUrl}
                         alt={name}/>}
            </h6>
            <p><small>{description}</small></p>
        </Link>
    );
}

export default CompanyCard;
