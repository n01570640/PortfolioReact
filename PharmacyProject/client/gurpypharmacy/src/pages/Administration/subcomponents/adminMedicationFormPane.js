import React, { useState, useEffect } from 'react';
import { InputText, Button, Checkbox, InputTextarea } from 'primereact';

const MedicalFormContent = ({ medication, isAddAction, onSubmit }) => {
    const initialFormData = {
        name: '',
        description: '',
        price: 0,
        quantityAvailable: 0,
        dosage: '',
        reorderThreshold: 0,
        requiresPrescription: false,
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        // For edit action, populate form with existing medication data
        if (medication && !isAddAction) {
            setFormData(medication);
        } else {
            setFormData(initialFormData); // Reset form for add action
        }
    }, [medication, isAddAction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // If the field is 'price', restrict to two decimal places
        if (name === 'price') {
          const re = /^[0-9]*(\.[0-9]{0,2})?$/; // regex to check the value
          // If the value matches the regex, update the state
          if (value === '' || re.test(value)) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
          }
        } else if (name === 'quantityAvailable' || name === 'reorderThreshold') {
          // Only allow whole numbers for quantity and reorderThreshold
          const re = /^\d*$/; // regex to check the value
          // If the value matches the regex (is a whole number), update the state
          if (value === '' || re.test(value)) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
          }
        } else {
          // For other fields, update the state as usual
          setFormData(prevState => ({ ...prevState, [name]: value }));
        }
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
                    {/* Name Field */}
                    <div className="col-6 dialog-form">
                        <label htmlFor="medicationName" className="dialog-label">Name</label>
                        <InputText id="medicationName" name="name" value={formData.name} onChange={handleChange} required className="dialog-input" />
                    </div>
                    {/* Price Field */}
                    <div className="col-6 dialog-form">
                        <label htmlFor="price" className="dialog-label">Price</label>
                        <InputText id="price" name="price" value={formData.price} onChange={handleChange} required className="dialog-input" type="number" step="0.01" />
                    </div>
                    {/* Description Field */}
                    <div className="col-12 dialog-form">
                        <label htmlFor="description" className="dialog-label">Description</label>
                        <InputTextarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5} className="dialog-input" />
                    </div>            
                    {/* Requires Prescription Checkbox */}
                    <div className="col-md-6 dialog-form">
                        <div className="checkbox-group">
                            <label htmlFor="requiresPrescription" className="dialog-label">Requires Prescription</label>
                            <Checkbox inputId="requiresPrescription" checked={formData.requiresPrescription} onChange={(e) => handleCheckboxChange(e, 'requiresPrescription')} />
                        </div>
                    </div>
                    {/* Dosage Field */}
                    <div className="col-6 dialog-form">
                        <label htmlFor="dosage" className="dialog-label">Dosage</label>
                        <InputText id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} required className="dialog-input" />
                    </div>
                    {/* Reorder Threshold Field */}
                    <div className="col-6 dialog-form">
                        <label htmlFor="reorderThreshold" className="dialog-label">Reorder Threshold</label>
                        <InputText id="reorderThreshold" name="reorderThreshold" value={formData.reorderThreshold} onChange={handleChange} required className="dialog-input" type="number" step="1" />
                    </div>
                     {/* Quantity Available Field */}
                    <div className="col-6 dialog-form">
                        <label htmlFor="quantityAvailable" className="dialog-label">Quantity Available</label>
                        <InputText id="quantityAvailable" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleChange} required className="dialog-input" type="number" step="1" />
                    </div>
                    {/* Active Checkbox */}
                    <div className="col-md-6 dialog-form">
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

export default MedicalFormContent;
