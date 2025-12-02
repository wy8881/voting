import React from 'react';
import '../styles/PasswordHelp.css';

const PasswordHelp = ({ password, isFocused, mode = 'register' }) => {
    if (!isFocused) {
        return null;
    }

    const criteria = [
        { regex: /.{8,}/, message: "At least 8 characters long" },
        { regex: /[a-z]/, message: "At least one lowercase letter" },
        { regex: /[A-Z]/, message: "At least one uppercase letter" },
        { regex: /[0-9]/, message: "At least one digit" },
        { regex: /[@$!%*?&#]/, message: "At least one special character (@$!%*?&#)" },
    ];

    const passedCriteria = criteria.filter(criteria => criteria.regex.test(password));
    const progress = (passedCriteria.length / criteria.length) * 100;

    const getProgressColor = () => {
        if (progress === 100) return '#10b981'; // green
        if (progress >= 60) return '#f59e0b'; // orange
        return '#dc2626';
    };

    if (mode === 'login') {
        return (
            <div className="password-help password-help-login">
                <div className="password-help-header">
                    <span className="password-help-title">Password Strength:</span>
                    <div className="password-progress-bar">
                        <div 
                            className="password-progress-fill" 
                            style={{ 
                                width: `${progress}%`, 
                                backgroundColor: getProgressColor() 
                            }}
                        ></div>
                    </div>
                    <span className="password-progress-text">
                        {progress === 100 ? 'Strong' : progress >= 60 ? 'Moderate' : 'Weak'}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="password-help">
            <div className="password-help-header">
                <span className="password-help-title">Password Requirements:</span>
                <div className="password-progress-bar">
                    <div 
                        className="password-progress-fill" 
                        style={{ 
                            width: `${progress}%`, 
                            backgroundColor: getProgressColor() 
                        }}
                    ></div>
                </div>
                <span className="password-progress-text">
                    {passedCriteria.length} of {criteria.length} requirements met
                </span>
            </div>
            <ul className="password-help-list">
                {criteria.map((criterion, index) => {
                    const isPassed = criterion.regex.test(password);
                    return (
                        <li 
                            key={index} 
                            className={`password-help-item ${isPassed ? 'passed' : ''}`}
                        >
                            <span className="password-help-icon">
                                {isPassed ? '✓' : '○'}
                            </span>
                            <span>{criterion.message}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PasswordHelp;

