import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
//importing reactprime components
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog';
//importing custom components
import '../App.css';
import { decodeToken, getToken } from './tokenUtils';
import AddPatientMedicationRecordPanel from './addPatientRecordPanel';

/**
 * MedicationProfile - A functional component that displays the medication profile for a specific patient.
 *
 * This component manages state for medication records, patient information, and the visibility of the medication record addition panel.
 * It also handles fetching of medication and patient data, and the addition of new medication records.
 */
export default function MedicationProfile() {
    const [medicationRecords, setMedicationRecords] = useState([]);
    const [patientInfo, setPatientInfo] = useState(null); 
    const { patientId } = useParams();
    const [isAddPatientMedicationRecordVisible, setisAddPatientMedicationRecordVisible] = useState(false);

    const toast = useRef(null);//For showing feedback message
    //fetching patient information
    const fetchPatientInfo = async (patientId) => {
        try {
            const token = getToken();
            
            const response = await fetch(`http://localhost:3001/api/patient/${patientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const patientData = await response.json(); 
            setPatientInfo(patientData.length > 0 ? patientData[0] : null); //storing the first object
            
        } catch (error) {
            console.error("Error fetching patient information: ", error);
        }
    };
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

    const fetchProfile = async () => {
        if (!patientId) {
            console.error("Patient ID is undefined.");
            return;
        }
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
            await fetchPatientInfo(patientId);
        } catch (error) {
            console.error("Error fetching medication profile: ", error);
        }
    };

    useEffect(() => { fetchProfile();}, [patientId]);

   
    //handle refill request 
    const handleRefill = async (detail) => {
        try{
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/refillMedication/patientId`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    medicationId: detail.medication,
                    patientId: patientId,
                    refillQuantity: detail.quantity
                })
            });
            
            if (!response.ok) {
                const errorDetail = await response.text(); // Get response as text
                console.error("Refill request error: ", errorDetail);
                toast.current.show({ severity: 'error', summary: 'Refill Error', detail: errorDetail, life: 3000, className: 'error-toast' });
                return;
            }

            const updatedMedication = await response.json();

            //update the state with the new medication data
            setMedicationRecords((prevRecords) => 
                prevRecords.map((record) => 
                record._id === updatedMedication._id ? updatedMedication : record
            ));

            if (response.ok) {
                // Refetch the medication profile
                fetchProfile();
                
            }
            toast.current.show({severity: 'success', summary: 'Success', detail: 'Refill request placed!', className: 'error-toast', life: 3000 });
        } catch(error){
            console.error("Error refillinf medication: ", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred during refill.', life: 3000 , className: 'error-toast'});
        }
    };
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
                            <p>Direction: {detail.direction}</p>
                            <Button className='button' icon="pi pi-replay" label="Refill Rx" disabled={detail.refillCount === 0} onClick={() => handleRefill(detail) }></Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
     //handle opening the form
     const openAddMedicationRecordPanel= () => {
        setisAddPatientMedicationRecordVisible(true);
    };

    //handle the add new patient record form submission
    const handleAddPatientMedicationRecordSubmit = async (formData) => {
        try {
            console.log(formData);
            const pharmacistId = decodeToken(getToken()).userId ;
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/patient/${patientId}/medication-records`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                patientId: patientId,
                pharmacistId: pharmacistId, 
                prescriptionDetails: [
                  {
                    medication: formData.medicationId,
                    quantity: formData.quantity,
                    dosage: formData.dosage,
                    refillCount: formData.refills, 
                    direction: formData.direction,
                  }
                ]
              })
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const result = await response.json();
            setMedicationRecords([...medicationRecords, result]);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Medication record added!', life: 3000, className: 'success-toast' });
            setisAddPatientMedicationRecordVisible(false);
            fetchProfile(); //refetch the patient's medication profile
          } catch (error) {
            console.error("Error adding patient medication record: ", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add medication record.', life: 3000, className: 'error-toast' });
          }
        setisAddPatientMedicationRecordVisible(false);
    };
    
    const legendTemplate = (
        <div className="legend-container">
            <span className="pi pi-user"></span>
            <span className="font-bold text-lg">Patient Medication Profile</span>
        </div>
    );

    const isPharmacist = decodeToken(getToken()).userType === 'Pharmacist';
    
    return (
        <div className='product-card'>
            <Fieldset legend={legendTemplate} className='custom-fieldset'>
                {patientInfo ? (
                    <div className='patient-list'>
                    <h3>{patientInfo.firstName} {patientInfo.lastName}</h3>
                    <p>Date of Birth: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}</p>
                    <p>Group ID: {patientInfo.groupId}</p>
                    <p>Insurance Name: {patientInfo.insName}</p>
                </div>
                ) : (
                    <p>Loading patient information...</p>
                )}
            </Fieldset>
            <Toast ref={toast} /> 
            
            {isPharmacist ? (
                    <Button className='button' onClick={openAddMedicationRecordPanel}>Add a drug</Button>
                ) : (
                    <div></div>
                )}            
            <Dialog header="Add Medication to Patient Record" className="dialog-background" visible={isAddPatientMedicationRecordVisible} 
                modal onHide={() => setisAddPatientMedicationRecordVisible(false)} style={{ width: '50vw', height:'50vh' }} >
                <AddPatientMedicationRecordPanel patientId={patientId} onSubmit={handleAddPatientMedicationRecordSubmit} />
            </Dialog>
            {medicationRecords.length > 0 ? (
                <div className='datascroller-container'>
                    <DataScroller value={medicationRecords} itemTemplate={medicationTemplate} rows={5} inline scrollHeight="500px" />
                </div>
            ) : (
                <p>No medication records found.</p>
            )}
        </div>
    );
}
