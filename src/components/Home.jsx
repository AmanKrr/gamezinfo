import React, { useEffect, useState } from "react";
import '../css/reboot.css';
import '../css/Home.css';

// home component
let Home = () => {

    let uniquePlatform = [];        // empty array for creating platform buttons
    const [games, setGames] = useState([]);     // usestate for storing fetched data
    const [inititalGames, setinititalGames] = useState([]);       // usestate for storing inital fetched data
    const [id, setId] = useState('');       // usestate for updating id
    const [key, setKey] = useState('');     // usestate for updating key matched while searching 
    const [showAll, setShowAll] = useState('');     // usestate for updating data
    const [sort, setSort] = useState('');       // usestate for updating data in sorted manner
    const [search, setSearch] = useState('');      // usestate for updating search value
    const [suggestion, setSuggestion] = useState([]);       // usestate for updating suggestion while searching
    
    // rednering one time only and fetching data through api.
    useEffect(() => {
        const onLoad = async () => {
            const url = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json';
            const response = await fetch(url);
            const data = await response.json();
            setGames(data);
            setinititalGames(data);
        }

        onLoad();   // calling onLoad
    }, []);

    // updating components whenever id value is changed
    useEffect(() => {
        // filtering data on the basis of id which is platfom name
        setGames(games.filter((data) => {
            return data.platform === id;
        }));
    }, [id]);

    // updating components whenever showAll value is changed
    useEffect(() => {
        // updating games array with initial fetched data
        setGames(() => {return inititalGames});
        return setShowAll(() => {return ''});
    }, [showAll])

    // updating component whenever sort value is changed
    useEffect(() => {
        // sort is ascending trigger if
        if(sort === 'ascending') {
            // updating games with sorted data in ascending order
            setGames(games.sort((a, b) => {
                return a.score - b.score;
            }));
        }   // else is triggered if sort is in descending order
        else if(sort === 'descending') {
            // updating games with sorted data in descending order
            setGames(games.sort((a, b) => {
                return b.score - a.score;
            }));     
        }  // at last cleaning sort value
        return setSort(() => {return ''});
    }, [sort])

    // updating component whenever key value is changed
    // render component when value in search bar becomes zero means key is empty
    useEffect(() => {
        // update suggestion
        if(key === '') {
            setSuggestion(() => {return []})
        }
    }, [key]);

    // update component whenever search value is changed
    useEffect(() => {
        // filtering games data on the basis of serach value and updating games data
        setGames(games.filter((data) => {
            return data.title === search;
        }));
    }, [search]);

    // method to get platforms
    let platformsMenu = (data) => {
        let platform = new Set();

        inititalGames.map((data) => {
            if(typeof data.platform !== 'undefined') platform.add(data.platform);
            return platform;
        })

        platform.forEach((data) => {
            uniquePlatform.push(data);
        })
    }

    // method to handle changes happedn in search bar
    let handleChanges = (event) => {
        if(games.length === 100) games.splice(0 , 1);           // removing garbage value
        let matchedKey = [];
        // start fitlering data from games on the basis of current value in search bar which we here saying key
        if(key.length >= 0) {
            matchedKey = games.filter((data) => {
                const regex = new RegExp(`${key}`, 'gi');
                return data.title.match(regex);
            });
        }
        setGames(inititalGames);        // update games data after filtering
        setSuggestion(matchedKey);      // update suggestion with matched key
        setKey(event.target.value);     // update key with current value in searchbar
    }

    // method to handle click when clicked on suggestion
    let onClickingSuggestion = (event) => {
        setKey(event.target.innerText);     // updating key with current value of suggestion
        setSuggestion([]);      // updating suggestion as empty => cleanup
    }

    // method to handle search on clicking search button
    let handleSearch = () => {  
        setGames(inititalGames);    // updating games data with initialgames data
        setSearch(() => {return key});      // updating search with the current value of search bar here we say key
    }

    // method to handle (ALL) button is clicked
    let handleClickAll = (event) => {
        setShowAll(() => {return event.target.id})      // updating showAll value
    }

    // method to handle click when platforms button are clicked
    let handleClick = (event) => {
        setGames(inititalGames);        // updating games data when clicked.
        setId(() => {return event.target.id})       // upadting id value
    }

    // method to handle sort in ascending order
    let handleSortAscending = (event) => {
        setGames(games);       // updating games data whenever ascending sort button is clicked
        setSort(() => {return event.target.id});    // updating sort value
    }

    // nethod to handle sort in descending order
    let handleSortDescending = (event) => {
        setGames(games);        // updating games data whenever descending sort button is clicked
        setSort(() => {return event.target.id});    // updating sort value
    }

    return (
        <div className='container'>
            <div className="header">
                <div className="branding">
                    <h1 className="brand-name">Gamez<span className="info">Info</span><span className="dot">.</span></h1>
                </div>
                <div className="search-container">
                    <div className="searchbar">
                        <input onChange={handleChanges} value={key} type="text" autoComplete="off" placeholder="Search by names" className="searchbar" id="srchbr" />
                        <div className="suggestion">
                            {suggestion && suggestion.map((data, index) => {
                                return (<div key={index} className='suggestions-name' id={index + 'Sg'} onClick={onClickingSuggestion}>{data.title}</div>)
                            })}
                        </div>
                    </div>
                    <div className="search-btn-container">
                        <button onClick={handleSearch} className="search-btn" id="srchbtn">Go</button>
                    </div>
                </div>
            </div>
            <div className="category">
                <div className="platforms">
                    <div className="by-platform"><p>By Platform</p></div>
                    <div className="buttons">
                        <div className="menuName">
                            <button onClick={handleClickAll} className="btn" id="All">All</button>
                        </div>
                        {platformsMenu()}
                        {uniquePlatform && uniquePlatform.map((data, index) => {
                            return (
                                <div className="menuName" key={index}>
                                    <button className="btn" id={data} onClick={handleClick}>{data}</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="games-sort">
                    <p className="sort-by-score">By score</p>
                    <div className="sort-a-d">
                        <div className="menuName">
                            <button onClick={handleSortAscending} className="btn" id="ascending">Ascending</button>
                        </div>
                        <div className="menuName">
                            <button onClick={handleSortDescending} className="btn" id="descending">Descending</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="games-list">
                {games && games.map((data, index) => {
                    if(games.length === 100) setGames(games.splice(0 , 1));
                    return (
                        <div className={'card' + index + ' ' + 'cards'} id={index + 'c'} key={index}>
                            <div className="title">
                                <p><span>Title:</span> {data.title}</p>
                            </div>
                            <div className="genre">
                                <p><span>Genere:</span> {data.genre}</p>
                            </div>
                            <div className="platform">
                                <p><span>Platform:</span> {data.platform}</p>
                            </div>
                            <div className="score">
                                <p><span>Score:</span> {data.score}</p>
                            </div>
                            <div className="editorchoice">
                                <p><span>Editors Choice:</span> {data.editors_choice}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;