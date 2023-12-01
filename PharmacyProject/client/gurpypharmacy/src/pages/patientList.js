//importing react components
import { useState, useEffect } from 'react';
//importing primereact component
import { OrderList } from 'primereact/orderlist';
import { Link } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
//importing styles
import '../App.css';
//importing date-fns for date-time formatting
import { format } from 'date-fns';
import { getToken } from "./tokenUtils";

export default function PatientList(){
    const [ patients , setPatients ] = useState([]);
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
                            to={`/medicationProfile/${patient._id}`} className='button' role="button">View</Link>
                        
                    </div>
                </div>
            </div>
        );
    };

    return(
        <div className="patient-list flex flex-wrap p-2 align-items-center gap-3">
            <OrderList value={patients} onChange={(e) => setPatients(e.value)} itemTemplate={patientTemplate} header="Patients" filter filterBy="lastName" ></OrderList>
        </div>
    );
}