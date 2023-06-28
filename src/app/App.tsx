import {Box, LinearProgress, ListItem, ListItemButton, ListItemText, TextField} from '@mui/material';
import React, {useState} from 'react';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {useElementHeight} from '../utils/UseElementHeight';
import './App.css';
import {useDictionaryService} from './UseDictionaryService';

function renderRow(props: ListChildComponentProps) {
    const {index, style, data} = props;

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <ListItemText primary={data[index]}/>
            </ListItemButton>
        </ListItem>
    );
}

function App() {
    const {loading, query, setQuery, items} = useDictionaryService();
    const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
    const wrapperHeight = useElementHeight(wrapperRef);

    return (
        <div className="app">
            <TextField className="search" label="Search..." variant="standard" value={query}
                       onChange={(e) => setQuery(e.target.value)} sx={{width: '100%'}}/>
            {loading && <LinearProgress/>}
            <Box className="list-wrapper" ref={setWrapperRef} sx={{width: '100%'}}>
                <FixedSizeList
                    height={wrapperHeight}
                    width={'100%'}
                    itemSize={46}
                    itemCount={items.length}
                    itemData={items}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
        </div>
    );
}

export default App;
