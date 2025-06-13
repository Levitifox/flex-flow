import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <small>© {new Date().getFullYear()} My Static Site. All rights reserved.</small>
        </footer>
    );
};

export default Footer;
