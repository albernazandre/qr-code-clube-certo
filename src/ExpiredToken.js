// ExpiredToken.js

import React from 'react';
import expiredImage from './assets/expired.png';

export default function ExpiredToken() {
    return (
        <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' } }>
            <img style={ { height: '200px', width: '200px', marginBottom: '70px', marginLeft: "-3vh" } } src={ expiredImage } alt="Some alt text" />
            <h1>Token Expirado</h1>
        </div>
    );
}
