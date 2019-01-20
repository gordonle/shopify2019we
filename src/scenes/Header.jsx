import React from "react";
import styled from "styled-components";
import Text from "../components/Text";

const HomeHero = styled("div")`
    height: 100px;
    text-align: center;
    background-image: ${({ theme }) => `linear-gradient(to right, ${theme.palette.myBlue}, ${theme.palette.myGreen})`};
    vertical-align: middle;
`;

// Since the title/header is completely separate from the searching, I felt that placing it in a separate scene would
//  avoid unnecessary recompiling, and would maintain a good separation of concerns.
const Title = () => (
    <HomeHero>
        <Text larger white>Toronto Waste Lookup</Text>
    </HomeHero>
)

export default Title;
