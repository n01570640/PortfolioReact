//importing react components
import { useState, useEffect } from 'react';
//importing primereact component
import { OrderList } from 'primereact/orderlist';

export default function PatientList(){
    const [ patients , setPatients ] = useState([]);

    const fetchPatientData = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/patients");
            console.log(response);
            const data = await response.json();
            console.log("DATA")
            console.log(data);
            setPatients(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
    }
     };


    useEffect(() => {fetchPatientData()}, []);

    //Patient template
    const patientTemplate = (patient) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">{patient.firstName}{ " " } {patient.lastName}  </span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{patient.telephoneNumber}</span>
                    </div>
                </div>
            </div>
        );
    };

    return(
        <div className="card xl:flex xl:justify-content-center">
            <OrderList value={patients} onChange={(e) => setPatients(e.value)} itemTemplate={patientTemplate} header="Patients" filter filterBy="lastName" ></OrderList>
        </div>
    );
}