import React from "react";
import styled from "styled-components";

const StyledText = styled("span")`
    text-align: center;
    font-size: ${props => props.large ? "24px" : props.larger ? "28px" : "16px"};
    color: ${props => props.white ? "white" : props.green ? "#23975e" : "black"};
    font-weight: bolder;
    line-height: ${props => props.larger? "90px" : "normal"};
`;

const Text = ({ children, ...otherProps }) => {
    return <StyledText {...otherProps}>{children}</StyledText>;
};

export default Text;
