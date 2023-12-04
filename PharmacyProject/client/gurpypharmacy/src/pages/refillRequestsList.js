import { useState, useEffect } from 'react';
//importing reactprime components
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
         
//importing custom components
import { getToken } from './tokenUtils';
import ConfirmFillingPanel from './confirmFillingPanel';

export default function RefillRequests() {
    const [refillRequests, setRefillRequests] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isConfirmFillingVisible, setisConfirmFillingVisible] = useState(false);
    const [selectedRefillRequest, setSelectedRefillRequest] = useState(null);

    useEffect(() => {
        fetchRefillRequests();
    }, []);
    
    //Getting the refill request orders
    const fetchRefillRequests = async () => {
        try {
            const token = getToken();
            const response = await fetch('http://localhost:3001/api/refillRequestOrders', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`  }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setRefillRequests(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    console.log(refillRequests)
    //formatted date
    const renderDate = (rowData) => {
        return new Date(rowData.requestDate).toLocaleDateString();
    };

    const fillRefillButtonTemplate = (rowData) => {
        return(
            <Button
                label='FILL'
                className='button'
                onClick={() => {
                    openConfirmFillingPanel();
                }} 
                disabled={rowData.status !== 'Filling'}
            />
        );
    };

    //handle opening the form
    const openConfirmFillingPanel = (rowData) => {
        setSelectedRefillRequest(" Selected: " , rowData); //not selecting but saving all the data
        setisConfirmFillingVisible(true);
    };

    console.log(selectedRefillRequest);
    //handle the add new patient record form submission
    const handleConfirmFillingSubmit = async (formData) => {
       
        setisConfirmFillingVisible(false);
    };

    const renderRefillRequestsTable = (statusFilter) => {
        const filteredRequests = refillRequests.filter(req => req.status === statusFilter);
    
        return (
            <DataTable value={filteredRequests}>
                <Column field="patientDetails.firstName" header="Patient Name" body={(rowData) => `${rowData.patientDetails.firstName} ${rowData.patientDetails.lastName}`} />
                <Column field="patientDetails.dateOfBirth" header="DOB" body={(rowData) => rowData.patientDetails.dateOfBirth ? new Date(rowData.patientDetails.dateOfBirth).toLocaleDateString() : ''} />
                <Column field="medicationId.name" header="Medication Name" />
                <Column field="medicationId.dosage" header="Dosage" />
                <Column field="fillQuantity" header="Fill Quantity" />
                <Column field="requestDate" header="Request Date" body={renderDate} />
                <Column body={fillRefillButtonTemplate} />
            </DataTable>
        );
    };

    const handleFillMedication = async (formData) => {
        // Update the refill request status and other details
    };
    return (
        <div className="'product-card'">
            <div className="flex flex-wrap gap-2 mb-3">
                <Button className="button" onClick={() => setActiveIndex(0)}  label="Filling" >
                    <Badge value={refillRequests.length} className='badgeUrgent'></Badge>
                </Button>
                <Button className="button" onClick={() => setActiveIndex(1)} label="Pick-Up" >
                    <Badge value={refillRequests.length} className='badgeComplete'></Badge>
                </Button>
                <Dialog header="Confirm Filling" className="dialog-background" visible={isConfirmFillingVisible} 
                modal onHide={() => setisConfirmFillingVisible(false)} style={{ width: '50vw', height:'50vh' }} >
                    <ConfirmFillingPanel patientId={selectedRefillRequest}  onSubmit={handleConfirmFillingSubmit} />
                </Dialog>
            </div>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Rx in Filling">
                    {renderRefillRequestsTable('Filling')}
                </TabPanel>
                <TabPanel header="Rx for Pick up">
                    {renderRefillRequestsTable('Ready for Pickup')}
                </TabPanel>
            </TabView>
        </div>
    )
}
        