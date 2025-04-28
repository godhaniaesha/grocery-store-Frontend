import React from 'react';
import '../styles/Home.css'

function Button(props) {
    return (
        <>
            <div className='d-flex justify-content-center' style={{width: '20%'}}>
                <button className='z_button p-2 px-5 text-white'>
                    Shop Now
                </button>
            </div>
        </>
    );
}

export default Button;