import React from "react";
import styled from "styled-components";
import _ from 'lodash';
import Text from "../components/TextComponent";


// Message is a styled div to display user action messages.
const Message = styled("div")`
    padding: 20px;
    color: grey;
`;

// isFavourites checks if "title" is amongst the items in "favourites"
const isFavourited = (title, favourites) => !!favourites.find(i => i.title === title);

// This styled form encapsulates the text input and the search button
const SearchBar = styled("form")`
    display: flex;
    padding: 20px;
    background: white;
`;

const SearchInput = styled("input")`
    height: 50px;
    width: 100%;
    padding: 0 10px;
    font-size: 20px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    outline-width: 0;
`;

const SearchButton = styled("button")`
    margin-left: 20px;
    width: 50px;
    height: 50px;
    background: #23975e;
    border-radius: 2px;
    border: 0;
    box-shadow: grey 0 1px 1px;
    &:hover{
        box-shadow: none;
        transform: translateY(1px);
        cursor: pointer;
    }
`;

const StyledStar = styled("i")`
    transition: 150ms;
    color: ${props => props.favourited ? props.theme.palette.myGreen : "lightgrey"};
    &:hover {
        color: ${({ theme }) => theme.palette.myGreen};
        cursor: pointer;
    }
`;

// Star changes the icon used depending on if the item is favourited or not
const Star = ({ isFavourited, onClick }) => 
    <StyledStar favourited={isFavourited} onClick={onClick} className={`${isFavourited ? "fas" : "far"} fa-star`} />;

// Displays each individual item in the list
const Items = ({ results, toggleFavourite, favourites }) => {
    return results.map(item => (
        <div style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between" }} key={item.title}>
            <div style={{ width: 35 }}>
                <Star isFavourited={isFavourited(item.title, favourites)} onClick={() => toggleFavourite(item)}/>
            </div>
            <div style={{ width: "30%", fontSize: 18 }}>
                {item.title}
            </div>
            <div style={{ width: "60%", paddingInlineStart: 40 }} dangerouslySetInnerHTML={{__html: _.unescape(item.body)}}>
            </div>
        </div>
    ))
}

class Searcher extends React.Component {
    constructor(props) {
        super(props);
        let favourites;
        // To allow our favourites list to persist, we check to see if
        //  we've saved it to localStorage. If yes, load it in!
        if (localStorage.hasOwnProperty("favourites")) {
            console.log("Found old favourites!");
            favourites = localStorage.getItem("favourites");
            try {
                favourites = JSON.parse(favourites);
            } catch(e) {
                favourites = [];
            }
        } else {
            favourites = [];
        }
        this.state = {
            value: "",
            error: null,
            isLoaded: false,
            items: [],
            results: [],
            favourites,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.searched = false;
    }

    componentDidMount() {
        fetch("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000")
            .then(res => res.json())
            .then(results => {
                results.forEach(result => result.favourite = false)
                this.setState({
                    isLoaded: true,
                    items: results,
                })
                console.log("Successfully loaded JSON Data");
            })
            .catch(e => {
                this.setState({
                    isLoaded: true,
                    error: e,
                })
                console.log("Failed to load JSON Data");
            })
    }

    toggleFavourite = item => {
        let favourites = this.state.favourites;
        const index = favourites.find(i => i.title === item.title);
        if (index) {
            favourites.splice(index, 1);
        } else {
            favourites = favourites.concat([item]);
        }
        localStorage.setItem( "favourites", JSON.stringify(favourites));
        this.setState({ favourites });
    }

    // This filters through the JSON data to display the correct items. I've set it up so that this calls
    //  as the user types, thus performing a live search! 
    filterItems = value => {
        // Since our JSON only contains < 200 objects, we can iterate through all of them relatively quickly
        const results = [];
        if (value !== "") {
            this.state.items.forEach(item => {
                if (item.keywords.search(value) > -1) {
                    results.push(item);
                }
            })
        }
        this.setState({ results });
    }

    handleChange() {
        this.searched = true;
        const value = this.search.value;
        if (value === "") this.setState({ results: [] });

        this.filterItems(value);
    }

    handleSubmit(event) {
        event.preventDefault();
        const { value } = this.search;

        this.filterItems(value);
    }

    // I've debounced the onChange call so that we can perform live searching while the user types
    render() {
        const { results, favourites, error } = this.state;
        const noResult = results.length || !this.searched || error !== null ? null :
            <Message>No search results, try searching items like "takeout".</Message>;
        const noFavourites = favourites.length ? null :
            <Message>Search for an item, then click the <i className="far fa-star"></i> on the left to favourite.</Message>                
        const badLoad = error === null ? null : 
            <Message>Sorry, we could not load the items. Please check your internet connection and refresh the page.</Message>
        return (
            <div>
                <SearchBar onSubmit={this.handleSubmit}>
                    <SearchInput 
                        type="text" 
                        ref={input => this.search = input}
                        onChange={ _.debounce(this.handleChange, 300) } 
                        placeholder="Search ..."/>
                    <SearchButton type="submit">
                        <i className="fas fa-flip-horizontal fa-search" 
                            style={{ fontSize: 22, color: "white" }}/>
                    </SearchButton>
                </SearchBar>
                <div style={{ background: "white", paddingBottom: 20 }}>
                    {noResult}
                    {badLoad}
                    <Items results={results} toggleFavourite={this.toggleFavourite} favourites={favourites}></Items>
                </div>
                <div style={{ padding: "20px 0" }}>
                    <Text large green style={{ padding: "0 20px" }}>Favourites</Text>
                    {noFavourites}
                    <Items results={favourites} 
                            toggleFavourite={this.toggleFavourite}
                            favourites={favourites}>
                                <Text large green>Favourites</Text>
                    </Items>
                </div>
            </div>
        );
    }
}

export default Searcher;
