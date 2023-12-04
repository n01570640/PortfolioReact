import React, { useState, useEffect } from 'react';
import { Button, InputText, InputTextarea } from 'primereact';

const ConfirmFillingPanel = ({ fillingRequestData, onSubmit }) => {
    const initialFormData = {
        name: '',
        dosage: '',
        medicationId: '',
        patientFName: '',
        patientLName: '',
        patientDOB: '',
        quantity: '',
        refills: '',
        direction: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    console.log(fillingRequestData);
    useEffect(() => {
        // Populate form with medication and patient data
        if (fillingRequestData) {
            setFormData({
                ...formData,
                name: fillingRequestData.medicationId.name,
                dosage: fillingRequestData.medicationId.dosage,
                medicationId: fillingRequestData.medicationId._id,
                patientFName: fillingRequestData.patientDetails.firstName,
                patientLName: fillingRequestData.patientDetails.lastName,
                patientDOB: new Date(fillingRequestData.patientDetails.dateOfBirth).toLocaleDateString(),
                direction: fillingRequestData.medicationId.direction,
            });
        }
    }, [fillingRequestData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            medicationId: formData.medicationId,
            quantity: formData.quantity,
            refills: formData.refills,
            direction: formData.direction,
        });
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Medication Name */}
                    <div className="col-6 dialog-form">
                        <label name="name" className="dialog-label">Medication Name</label>
                        <InputText value={formData.name} disabled />
                    </div>
                    {/* Dosage */}
                    <div className="col-6 dialog-form">
                        <label name="dosage" className="dialog-label">Dosage</label>
                        <InputText value={formData.dosage} disabled />
                    </div>
                    {/* Quantity Field */}
                    <div className="col-12 dialog-form">
                        <label className="dialog-label">Quantity</label>
                        <InputText id="quantity" name="quantity" placeholder="Enter Quantity" onChange={handleInputChange} />
                    </div>
                    {/* Refills Field */}
                    <div className="col-12 dialog-form">
                        <label className="dialog-label">Refills</label>
                        <InputText id="refills" name="refills" placeholder="Enter Refills" onChange={handleInputChange} />
                    </div>
                    {/* Direction Field */}
                    <div className="col-12 dialog-form">
                        <label className="dialog-label">Direction</label>
                        <InputTextarea id="direction" name="direction" value={formData.direction} onChange={handleInputChange} rows={3} />
                    </div>
                    {/* Submit Button */}
                    <div className="col-12">
                        <Button className="button button-dialog" type="submit" label="Confirm Fill" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ConfirmFillingPanel;
