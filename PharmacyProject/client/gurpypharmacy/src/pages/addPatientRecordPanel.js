import { useState, useEffect } from 'react';
import { AutoComplete, Button, InputText, InputTextarea } from 'primereact';

const AddPatientMedicationRecordPanel = ({ patientId,  onSubmit }) => {
    const initialFormData = {
        name: '',
        dosage: '',
        medicationId: '',
        quantity: '',
        refills: '',
        direction: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState(null);
    
    //fetching the medications list that match
    const searchMedications = async (event) => {
        try {
            const response = await fetch(`http://localhost:3001/api/medications/search?q=${encodeURIComponent(event.query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const medications = await response.json();
            setFilteredMedications(medications);
        } catch (error) {
            console.error("Error fetching medications: ", error);
        }
    };

    const onMedicationSelect = (e) => {
        setSelectedMedication(e.value);
        setFormData({
            ...formData,
            medicationId: e.value._id,
            name: e.value.name,
            dosage: e.value.dosage,
            direction: e.value.direction,
            quantity: e.value.quantity,
            refills: e.value.refills,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            patientId,
            medicationId: formData.medicationId,
            quantity: formData.quantity,
            dosage: formData.dosage,
            refills: formData.refills,
            direction: formData.direction,
        });
    };
    return (
        <div className="container">
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Name Field */}
                <div className="col-6 dialog-form">
                    <label className="dialog-label">Name</label>
                    <AutoComplete value={selectedMedication}
                              suggestions={filteredMedications}
                              completeMethod={searchMedications}
                              field="name"
                              itemTemplate={(item) => <div>{item.name}</div>}
                              onChange={onMedicationSelect}
                              placeholder="Search for a Medication" />
                </div>
                {/* Dosage field */}
                <div className="col-6 dialog-form">
                    <label htmlFor="dosage" className="dialog-label">Dosage</label>
                    <InputText id="dosage" name="dosage" value={formData.dosage} onChange={handleInputChange} required className="dialog-input" />
                    
                </div>
                {/* Medication Id Field */}
                <div className="col-8 dialog-form">
                    <label htmlFor="medicationId" className="dialog-label">Medication Id</label>
                    <InputText id="medicationId" name="medicationId" value={formData.medicationId} onChange={handleInputChange} required className="dialog-input" />
                    
                </div>
                {/* Quanitity Field */}
                <div className="col-6 dialog-form">
                    <label htmlFor="quantity" className="dialog-label">Quantity</label>
                    <InputText  id="quantity" name="quantity" placeholder="Quantity" onChange={handleInputChange}/>
                </div>     
                 {/* Refill Field */}
                 <div className="col-6 dialog-form">
                    <label htmlFor="refills" className="dialog-label">Refills</label>
                    <InputText id="refills" name="refills" placeholder="Refills" onChange={handleInputChange}/>
                </div>    
                 {/* Direction Field */}
                 <div className="col-12 dialog-form">
                        <label htmlFor="direction" className="dialog-label">Description</label>
                        <InputTextarea id="direction" name="direction" required rows={3} className="dialog-input" onChange={handleInputChange}/>
                </div>  
                {/* Submit Button */}
                <div className="col-12">
                <Button className="button button-dialog" type="submit" label="Fill Rx" />
                </div>
            </div>
        </form>
    </div>
        
    );
};

export default AddPatientMedicationRecordPanel;
