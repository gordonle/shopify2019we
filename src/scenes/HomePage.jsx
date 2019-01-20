import React from "react";
import Title from "./Header"
import Searcher from "./Searcher"

class HomePage extends React.Component {
    render() {
        return (
        <div style={{ padding: 0 }}>
            <Title></Title>
            <Searcher></Searcher>
        </div>
        );
    }
}

export default HomePage;
