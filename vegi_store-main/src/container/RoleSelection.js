import React, { useState } from 'react';
import '../styles/x_app.css';

const RoleSelection = () => {
    const [selectedOption, setSelectedOption] = useState('15-25');

    const options = [
        { id: 'option1', value: '10-15', label: '10% - 15%' },
        { id: 'option2', value: '15-25', label: '15% - 25%' },
        { id: 'option3', value: '25+', label: 'More than 25%' }
    ];

    return (
        <div className="x_radio-group">
            {options.map((option) => (
                <label key={option.id} className="x_radio-wrapper">
                    <input
                        type="radio"
                        name="percentageOption"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={() => setSelectedOption(option.value)}
                        className="x_radio-input"
                    />
                    <span className="x_radio-custom"></span>
                    <span className="x_radio-label">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default RoleSelection;