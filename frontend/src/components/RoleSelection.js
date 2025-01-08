import React from 'react';
import { useNavigate } from 'react-router-dom';
import logos from "../assets/logos.png"; // Import the shared logo file
import '../styles/RoleSelection.css'; // Add this for CSS styles

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/register?role=${role}`);
    };
    console.log("Selected role:", role);

    return (
        <div className="role-selection-container">
            {/* Header */}
            <header className="role-selection-header">
                <div className="header-left">
                    <img
                        src={logos}
                        alt="Logo"
                        className="gov-ndis-logo" // Combined class for consistent styling
                    />
                </div>
                <div className="header-right">
                    <h2>User Registration</h2>
                </div>
            </header>

            {/* Horizontal Separator */}
            <hr className="separator" />

            {/* Main Content */}
            <main className="role-selection-main">
                <h1>Please select your role</h1>
                <div className="role-buttons">
                    <button
                        className="role-button admin-button"
                        onClick={() => handleRoleSelect('admin')}
                    >
                        Provider Administrator
                    </button>
                    <button
                        className="role-button staff-button"
                        onClick={() => handleRoleSelect('staff')}
                    >
                        Provider Staff
                    </button>
                </div>
            </main>
        </div>
    );
};

export default RoleSelection;
