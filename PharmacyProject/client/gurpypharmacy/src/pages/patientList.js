//importing react components
import { useState, useEffect , useRef} from 'react';
//importing primereact component
import { OrderList } from 'primereact/orderlist';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
//importing styles
import '../App.css';
//importing date-fns for date-time formatting
import { format } from 'date-fns';
//importing custom components
import { getToken } from "./tokenUtils";
import AddPatientForm from './addPatientForm'; // Import the AddPatientForm


/**
 * PatientList - A functional component for displaying and managing a list of patients.
 *
 * Utilizes state to manage the list of patients, and the visibility of the Add Patient dialog.
 * Offers functionalities to add a new patient, and fetch patient data.
 */

export default function PatientList(){
    const [ patients , setPatients ] = useState([]);
    const [isAddPatientDialogVisible, setIsAddPatientDialogVisible] = useState(false);
    const toast = useRef(null);//For showing feedback message

    const showAddPatientDialog = () => setIsAddPatientDialogVisible(true);
    const hideAddPatientDialog = () => setIsAddPatientDialogVisible(false);

    const handleAddPatientSubmit = async (patientData) => {
        submitNewPatient(patientData);
        hideAddPatientDialog();
    };

    const submitNewPatient = async (patientData) => {
        try {
            const response = await fetch(`http://localhost:3001/api/addPatient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify(patientData) // Send the patientData directly
            });
            if(response.status === 400){
                toast.current.show({ severity: 'error', summary: 'Error', detail: "User already exists! Try again!", life: 3000, className: 'error-toast' });
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); // Handle the promise correctly
            fetchPatientData(); // Fetch the updated list of patients
        } catch (error) {
            console.error("Error saving patient: ", error);
        }
    }
    //Fetching the patient data from backend point "/api/patients"
    const fetchPatientData = async () => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:3001/api/patients", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patient data: ", error);
        }
    };

    useEffect(() => {fetchPatientData()}, []);

    //Patient template
    const patientTemplate = (patient) => {
        //console.log(patient.dateOfBirth);
        const formatDateOfBirth = (dob) => {
            //console.log('Date of Birth:', dob);
            try{
                return format(new Date(dob), 'PP') //eg: "Jan 1, 2020"
            } catch(error) {
                console.error('Error formatting date: ', error);
                return 'Invalid Date'
            }
        }
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <i className="pi pi-user" style={{ fontSize: '2.5rem' }}></i>
                    <span className="font-bold">{patient.firstName}{ " " } {patient.lastName}  </span>
                    <div className="flex align-items-center gap-2">
                        
                        <i className="pi pi-calendar text-sm"></i>
                        <span>{formatDateOfBirth(patient.dateOfBirth)}</span>
                        <i className="pi pi-phone text-sm"></i>
                        <span>{patient.telephoneNumber}</span>
                        <Link 
                            /**Links the button to the patient medication profile using patientid */
                            to={`/medicationProfile/${patient.patientId}`} className='button' role="button">View</Link>
                        
                    </div>
                </div>
            </div>
        );
    };

    return(
        <div className="patient-list flex flex-wrap p-2 align-items-center gap-3">
            <Button label="Add New Patient" onClick={showAddPatientDialog} className="button" role="button" />
            <br/>
            <Toast ref={toast} /> 
            <Dialog header="Add New Patient" visible={isAddPatientDialogVisible} className="dialog-background" onHide={hideAddPatientDialog} style={{ width: '60vw', height:'50vh' }} breakpoints={{ '960px': '75vw,65vw', '641px': '100vw,100vh' }}>
                <AddPatientForm onSubmit={handleAddPatientSubmit} />
            </Dialog>
            <br/>
            <OrderList value={patients} onChange={(e) => setPatients(e.value)} itemTemplate={patientTemplate} header="Patients" filter filterBy="lastName" ></OrderList>
        </div>
    );
}