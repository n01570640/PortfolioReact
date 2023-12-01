import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataScroller } from 'primereact/datascroller';
import { getToken } from './tokenUtils';

export default function MedicationProfile() {
    const [medicationRecords, setMedicationRecords] = useState([]);
    const { patientId } = useParams();

    const fetchMedicationDetails = async (medicationId) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/medication/${medicationId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching medication details: ", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                const response = await fetch(`http://localhost:3001/api/medicationProfile/${patientId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                let profileData = await response.json();

                // Fetch detailed medication information
                for (let record of profileData) {
                    for (let detail of record.prescriptionDetails) {
                        const medicationInfo = await fetchMedicationDetails(detail.medication);
                        detail.medicationInfo = medicationInfo; // Add detailed info to each prescription detail
                    }
                }

                setMedicationRecords(profileData);
            } catch (error) {
                console.error("Error fetching medication profile: ", error);
            }
        };

        fetchProfile();
    }, [patientId]);

    const medicationTemplate = (record) => {
        return (
            <div className="medication-record">
                <h3>Prescription Date: {new Date(record.prescriptionDate).toLocaleDateString()}</h3>
                <p>Last Refill Date: {new Date(record.lastRefillDate).toLocaleDateString()}</p>
                <div>
                    {record.prescriptionDetails.map((detail) => (
                        <div key={detail._id} className="medication-detail">
                            <p>Medication Name: {detail.medicationInfo?.name}</p>
                            <p>Dosage: {detail.dosage}</p>
                            <p>Quantity: {detail.quantity}</p>
                            <p>Refill Count: {detail.refillCount}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className='card'>
            <h2>Medication Profile</h2>
            {medicationRecords.length > 0 ? (
                <DataScroller value={medicationRecords} itemTemplate={medicationTemplate} rows={5} inline scrollHeight="500px" />
            ) : (
                <p>No medication records found.</p>
            )}
        </div>
    );
}
