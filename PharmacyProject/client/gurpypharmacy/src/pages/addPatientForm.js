import React, { useState } from 'react';
import { InputText, Button, Calendar } from 'primereact';

const AddPatientForm = ({ onSubmit }) => {
    const initialFormData = {
        username: '', // Email field for username
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        groupId: '',
        insName: '',
        telephoneNumber: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (e) => {
        setFormData(prevState => ({ ...prevState, dateOfBirth: e.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialFormData); // Reset form after submission
    };

    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setDate(oneHundredYearsAgo.getDate() - 100);
    const today = new Date();

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="col-12 dialog-form">
                    <label htmlFor="username" className="dialog-label">Email</label>
                    <InputText id="username" name="username" value={formData.username} onChange={handleChange} required className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="firstName" className="dialog-label">First Name</label>
                    <InputText id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="lastName" className="dialog-label">Last Name</label>
                    <InputText id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="dateOfBirth" className="dialog-label">Date of Birth</label>
                    <Calendar id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleDateChange} showIcon required dateFormat="yy-mm-dd" className="dialog-input" minDate={oneHundredYearsAgo} maxDate={today} />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="groupId" className="dialog-label">Group ID</label>
                    <InputText id="groupId" name="groupId" value={formData.groupId} onChange={handleChange} className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="insName" className="dialog-label">Insurance Name</label>
                    <InputText id="insName" name="insName" value={formData.insName} onChange={handleChange} className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <label htmlFor="telephoneNumber" className="dialog-label">Telephone Number</label>
                    <InputText id="telephoneNumber" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} className="dialog-input" />
                </div>
                <div className="col-12 dialog-form">
                    <Button type="submit" label="Submit" className="button button-dialog" />
                </div>
            </form>
        </div>
    );
};

export default AddPatientForm;
