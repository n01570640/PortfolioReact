import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//importing reactprime components
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
//importing custom components
import { getToken } from './tokenUtils';

export default function MedicationProfile() {
    const [medicationRecords, setMedicationRecords] = useState([]);
    const { patientId } = useParams();
    //fetching medication information
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
        //fetching patient's medication record
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

                // fetch detailed medication information for each medication
                for (let record of profileData) {
                    for (let detail of record.prescriptionDetails) {
                        const medicationInfo = await fetchMedicationDetails(detail.medication);
                        detail.medicationInfo = medicationInfo; // add detailed info to each prescription detail
                    }
                }

                setMedicationRecords(profileData);
            } catch (error) {
                console.error("Error fetching medication profile: ", error);
            }
        };

        fetchProfile();
    }, [patientId]);
    //medication template
    const medicationTemplate = (record) => {
        return (
            <div className="medication-record">
                <h3>Prescription Date: {new Date(record.prescriptionDate).toLocaleDateString()}</h3>
                <p>Last Refill Date: {new Date(record.lastRefillDate).toLocaleDateString()}</p>
                <div>
                    {record.prescriptionDetails.map((detail) => (
                        <div key={detail._id} className="medication-detail">
                            <p>{detail.medicationInfo?.name}{" "}{detail.dosage}</p>
                            <p>Quantity: {detail.quantity}</p>
                            <p>Refill Count: {detail.refillCount}</p>
                            <Button className='button' icon="pi pi-replay" label="Refill Rx" disabled={detail.refillCount === 0}></Button>
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
