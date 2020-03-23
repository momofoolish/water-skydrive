import React from 'react';
import MyLayout from './layout/layout';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <MyLayout />
        </BrowserRouter>
    )
}

export default App;