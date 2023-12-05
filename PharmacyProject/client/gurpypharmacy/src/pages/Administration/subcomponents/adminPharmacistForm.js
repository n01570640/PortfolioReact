import React, { useState, useEffect } from 'react';
//importing primereact components
import { InputText, Button, Checkbox } from 'primereact';

/**
 * AdminPharmacistForm: Form component for adding or editing pharmacist details.
 * 
 * Features:
 * - Provides input fields for pharmacist ID, license number, and active status.
 * - Handles data changes and submits the form data to the parent component.
 * - Uses useEffect to populate the form with existing pharmacist data for editing.
 */

const AdminPharmacistForm = ({ pharmacist, isAddAction, onSubmit }) => {
    const initialFormData = {
        pharmacistId: '',
        licenseNumber: '',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (pharmacist && !isAddAction) {
            setFormData(pharmacist);
        } else {
            setFormData(initialFormData);
        }
    }, [pharmacist, isAddAction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCheckboxChange = (e, field) => {
        setFormData(prevState => ({ ...prevState, [field]: e.checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Pharmacist usernameField */}
                    <div className="col-12 dialog-form">
                        <label htmlFor="username" className="dialog-label">Username (Email)</label>
                        <InputText id="username" name="username" value={formData.username} onChange={handleChange} required className="dialog-input" type="email"/>
                    </div>

                    {/* License Number Field */}
                    <div className="col-12 dialog-form">
                        <label htmlFor="licenseNumber" className="dialog-label">License Number</label>
                        <InputText id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="dialog-input" />
                    </div>
                    {/* Active Checkbox */}
                    <div className="col-12 dialog-form">
                        <div className="checkbox-group">
                            <label htmlFor="isActive" className="dialog-label">Active</label>
                            <Checkbox inputId="isActive" checked={formData.isActive} onChange={(e) => handleCheckboxChange(e, 'isActive')} />
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="col-12">
                        <Button type="submit" label="Save" className="button button-dialog" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminPharmacistForm;
