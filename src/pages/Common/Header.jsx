import React from 'react';
import Navigation from './Navigation';

function Header(){
        return(
        <header className="bg-red-800 text-white bold font-bold p-6 bg-primary-dark flex justify-between items-center">
            <Navigation/>
            <h1 className="text-3xl font-brand">Welcome to LG's Car Hire</h1>
            <hr></hr>
        </header>
    );
}

export default Header;