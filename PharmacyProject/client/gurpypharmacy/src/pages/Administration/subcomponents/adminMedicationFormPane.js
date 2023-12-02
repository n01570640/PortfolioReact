import React, { useState, useEffect } from 'react';
import {InputText, Button } from 'primereact';
import addMeds from '../../../images/addMeds.png';

const MedicalFormContent = ({ medication, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        quantityAvailable: 0,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Form rendering
    return (
        <form onSubmit={handleSubmit}>
            <div className='form-field'>
                 <label htmlFor='medicationName' className="form-label">Name</label>
                  <InputText className="form-input" id="medicationName" value={formData.name} onChange={handleChange} required />
             </div>
             <div className='form-field'>
                 <label htmlFor='price' className="form-label">Price</label>
                  <InputText className="form-input" id="price" value={formData.price} onChange={handleChange} required />
             </div>

            <Button label="Save" type="submit" className="button"/>
        </form>
    );
};

export default MedicalFormContent;
