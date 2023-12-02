import React, { useState, useEffect } from 'react';
import { InputText, Button, Checkbox, InputTextarea } from 'primereact';

const MedicalFormContent = ({ medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        quantityAvailable: 0,
        isActive: true
    });

    useEffect(() => {
        if (medication) {
            setFormData(medication);
        }
    }, [medication]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        setFormData(prevState => ({ ...prevState, isActive: e.checked }));
    };

    const handleSubmit = (e) => {
        console.log(formData);
        e.preventDefault();
        onSubmit(formData);
    };

    // Form rendering
    return (
        <form onSubmit={handleSubmit}>
            <div className='dialog-form'>
                <label htmlFor='medicationName' className="dialog-label">Name</label>
                <InputText className="dialog-input" id="medicationName" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className='dialog-form'>
                <label htmlFor='price' className="dialog-label">Price</label>
                <InputText className="dialog-input" id="price" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className='dialog-form'>
                <label htmlFor='description' className="dialog-label">Description</label>
                <InputTextarea className="dialog-input" id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className='dialog-form'>
                <label htmlFor='isActive' className="dialog-label">Active</label>
                <Checkbox inputId="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />
            </div>

            <Button label="Save" type="submit" className="button"/>
        </form>
    );
};

export default MedicalFormContent;
