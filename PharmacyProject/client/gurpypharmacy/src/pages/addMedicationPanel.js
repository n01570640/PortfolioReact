import { useState } from 'react';
//importing primereact components
import { AutoComplete, Button, InputText } from 'primereact';

const AddMedicationPanel = ({ patientId, onSubmit }) => {
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [dosage, setDosage] = useState('');
    //searching for medication available
    const searchMedications = async (event) => {
        try {
            const response = await fetch(`http://localhost:3001/api/medications/search?q=${event.query}`);
            const data = await response.json();
            setFilteredMedications(data);
        } catch (error) {
            console.error("Error fetching medications: ", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedMedication && quantity > 0 && dosage) {
            onSubmit({ patientId, medicationId: selectedMedication._id, quantity, dosage });
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <AutoComplete value={selectedMedication} suggestions={filteredMedications} completeMethod={searchMedications}
                              field="name" dropdown forceSelection onChange={(e) => setSelectedMedication(e.value)}
                              placeholder="Search for a Medication" />
                <InputText value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
                <InputText value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage" />
                <Button type="submit" label="Associate Medication" />
            </form>
        </div>
    );
};

export default AddMedicationPanel;
