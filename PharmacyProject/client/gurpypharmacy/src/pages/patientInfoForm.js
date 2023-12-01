import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { decodeToken } from './tokenUtils'; // Update the path accordingly

const PatientInfoForm = ({ data, editable, onSubmit, onCancel, onEdit }) => {
    const defaultPatientInfo = {
        groupId: '',
        insName: '',
        dateOfBirth: null,
        firstName: '',
        lastName: '',
        telephoneNumber: ''
    };

    const [patientInfo, setPatientInfo] = useState({
        ...defaultPatientInfo,
        ...data
    });
    const [initialData, setInitialData] = useState({
        ...defaultPatientInfo,
        ...data,
        dateOfBirth: data && data.dateOfBirth ? new Date(data.dateOfBirth) : null
    });

    useEffect(() => {
        if (data && data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        setPatientInfo({
            ...defaultPatientInfo,
            ...data
        });
        setInitialData({
            ...defaultPatientInfo,
            ...data,
            dateOfBirth: data && data.dateOfBirth ? new Date(data.dateOfBirth) : null
        });
        // defaultPatientInfo is a constant defined inside the component and does not change over time, so we can safely ignore this warning.
         // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo({ ...patientInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const userToken = localStorage.getItem('userToken');
            const decoded = decodeToken(userToken);
            const userId = decoded ? decoded.userId : null;
            
            const patientData = {
                ...patientInfo,
                patientId: userId // Include the user ID as patientId
            };
    
            console.log(patientData);
            const response = await fetch('http://localhost:3001/api/upsertPatientInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify(patientData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const updatedInfo = await response.json();
            onSubmit(updatedInfo); // Call the passed onSubmit function with the updated info
            setInitialData(updatedInfo);
        } catch (error) {
            console.error("Error updating patient info: ", error);
        }
    };

    const handleCancel = () => {
        setPatientInfo(initialData);
        onCancel();
    };

    const oneHundredYearsAgo = new Date();
    oneHundredYearsAgo.setDate(oneHundredYearsAgo.getDate() - 100);
    const today = new Date();

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="groupId">Group ID</label>
                <InputText id="groupId" name="groupId" className="form-input"  value={patientInfo.groupId} onChange={handleInputChange} required disabled={!editable} />
            </div>

            <div className="form-field">
                <label htmlFor="insName">Insurance Name</label>
                <InputText id="insName" name="insName" className="form-input"  value={patientInfo.insName} onChange={handleInputChange} required disabled={!editable} />
            </div>

            <div className="form-field">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <Calendar id="dateOfBirth" name="dateOfBirth" className="" value={patientInfo.dateOfBirth} onChange={handleInputChange} showIcon required disabled={!editable} minDate={oneHundredYearsAgo} maxDate={today}/>
            </div>

            <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <InputText id="firstName" name="firstName" className="form-input"  value={patientInfo.firstName} onChange={handleInputChange} required disabled={!editable} />
            </div>

            <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <InputText id="lastName" name="lastName" className="form-input"  value={patientInfo.lastName} onChange={handleInputChange} required disabled={!editable} />
            </div>

            <div className="form-field">
                <label htmlFor="telephoneNumber">Telephone Number</label>
                <InputText id="telephoneNumber" name="telephoneNumber" className="form-input"  value={patientInfo.telephoneNumber} onChange={handleInputChange} required disabled={!editable} />
            </div>

            {editable && <Button label="Submit" className="button" type="submit" />}
            {editable && <Button label="Cancel" className="button" onClick={handleCancel} />}
        </form>
    );
};

export default PatientInfoForm;
