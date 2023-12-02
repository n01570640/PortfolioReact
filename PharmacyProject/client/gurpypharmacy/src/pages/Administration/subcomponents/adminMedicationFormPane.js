import React, { useState, useEffect } from 'react';
import {InputText, Button, Checkbox } from 'primereact';
import '../../../App.css';
import 'primeicons/primeicons.css';

const MedicalFormContent = ({ medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        quantityAvailable: 0,
        isActive: true
    });

    useEffect(() => {
        if (medication) {
            setFormData({
                ...medication
            });
        }
    }, [medication]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSwitchChange = (e) => {
        setFormData(prevState => ({ ...prevState, isActive: e.checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Form rendering
    return (
        <form onSubmit={handleSubmit}>
            <div className='dialog-form'>
                <label htmlFor='medicationName' className="dialog-label">Name</label>
                <InputText className="dialog-input" id="medicationName" value={formData.name} onChange={handleChange} required />
            </div>
            <div className='dialog-form'>
                <label htmlFor='price' className="dialog-label">Price</label>
                <InputText className="dialog-input" id="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className='dialog-form'>
                <label htmlFor='isActive' className="dialog-label">Active</label>
                <Checkbox 
                    inputId="isActive" 
                    checked={formData.isActive} 
                    onChange={handleSwitchChange} 
                />
            </div>
           

            <Button label="Save" type="submit" className="button"/>
        </form>

    );
};

export default MedicalFormContent;
