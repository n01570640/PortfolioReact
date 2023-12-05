import React, { useState, useEffect } from 'react';
import { Button, InputText, InputTextarea } from 'primereact';


/**
 * ConfirmFillingPanel - A functional component to display and manage the filling confirmation form for a medication refill request.
 *
 * Manages the state of the form data and updates it based on the provided medication refill request data.
 * Handles form submission with the updated medication refill information.
 * @param {object} props - The component props.
 * @param {object} props.fillingRequestData - The data of the refill request to be filled.
 * @param {function} props.onSubmit - Callback function to handle form submission.
 */
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
                        <label name="name" className="dialog-label">Medication</label>
                        <InputText value={formData.name} disabled className="dialog-input" />
                    </div>
                    {/* Dosage */}
                    <div className="col-6 dialog-form">
                        <label name="dosage" className="dialog-label">Dosage</label>
                        <InputText value={formData.dosage} disabled className="dialog-input" />
                    </div>
                    {/* Quantity Field */}
                    <div className="col-6 dialog-form">
                        <label className="dialog-label">Quantity</label>
                        <InputText id="quantity" name="quantity" placeholder="Enter Quantity" onChange={handleInputChange}className="dialog-input" />
                    </div>
                    {/* Refills Field */}
                    <div className="col-6 dialog-form">
                        <label className="dialog-label">Medication ID</label>
                        <InputText value={formData.medicationId} disabled className="dialog-input" />
                    </div>
                    {/* Direction Field */}
                    <div className="col-6 dialog-form">
                        <label className="dialog-label">First Name</label>
                        <InputText value={formData.patientFName} disabled className="dialog-input"  />
                    </div>
                    {/* Direction Field */}
                    <div className="col-6 dialog-form">
                        <label className="dialog-label">Last Name</label>
                        <InputText value={formData.patientLName} disabled className="dialog-input" />
                    </div>
                    {/* Direction Field */}
                    <div className="col-6 dialog-form">
                        <label className="dialog-label">Date Of Birth</label>
                        <InputText value={formData.patientDOB} disabled className="dialog-input" />
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
