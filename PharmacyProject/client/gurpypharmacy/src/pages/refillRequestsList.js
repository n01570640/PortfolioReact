import { useState, useEffect } from 'react';
//importing reactprime components
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode} from 'primereact/api';
import { InputText } from 'primereact/inputtext';
         
//importing custom components
import ConfirmFillingPanel from './confirmFillingPanel';
import { api } from '../api';
import '../App.css';
/**
 * RefillRequests - A functional component for displaying and managing refill requests.
 *
 * Manages state for refill requests, dialog visibility, and selected refill request.
 * Implements fetching of refill requests and updating their status.
 */
export default function RefillRequests() {
    const [refillRequests, setRefillRequests] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isConfirmFillingVisible, setIsConfirmFillingVisible] = useState(false);
    const [selectedRefillRequest, setSelectedRefillRequest] = useState(null);

    //setting filters
    const [filters, setFilters] = useState({
        'patientDetails.firstName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'medicationId.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        fetchRefillRequests();
    }, []);
    
    //Getting the refill request orders
    const fetchRefillRequests = async () => {
        try {
            const response = await api.get('/api/refillRequestOrders');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setRefillRequests(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    //When filling is complete, updating the status
    const updateRefillRequestStatus = async (requestId, newStatus, fillQuantity) => {
        try {
            const response = await api.patch(`/api/refillRequestOrders/${requestId}`, { newStatus, fillQuantity });
    
            if (!response.ok) throw new Error('Network response was not ok');
    
            // Refresh the list or handle UI update accordingly
            fetchRefillRequests();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    //Complete refill request by deleting it from the collection
    const completeRefillRequest = async (requestId) => {
        try{
            const response = await api.del(`/api/completeRefillRequestOrder/${requestId}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            //Refresh the page
            fetchRefillRequests();
            
        } catch (error){
            console.error("Error in completing a refill: ", error);
        }
    }


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setFilters((prevFilters) => {
            // Create a new object with all previous filters, and set/change the global filter value
            return {
                ...prevFilters,
                // If you are using a global filter, ensure it's defined in the initial state
                // Otherwise, this line should be removed or modified accordingly
                global: { value: value, matchMode: FilterMatchMode.CONTAINS }
            };
        });
        setGlobalFilterValue(value);
    };
    

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </div>
        );
    };
    const header = renderHeader();
    //formatted date
    const renderDate = (rowData) => {
        return new Date(rowData.requestDate).toLocaleDateString();
    };

    const fillRefillButtonTemplate = (rowData) => {
        // a balance owed is filled the same way as a new request, once stock is back
        return rowData.status === 'Filling' || rowData.status === 'Balance' ? (
            <Button
                label='Fill'
                className='button'
                onClick={() => openConfirmFillingPanel(rowData)}
            />
        ) : null ;
    };
    const completeRefillButtonTemplate = (rowData) => {
        return rowData.status === 'Ready' ? (
            <Button
                label='Complete Pickup'
                className='button'
                onClick={() => completeRefillRequest(rowData._id)} 
                disabled={rowData.status !== 'Ready'}
            />
        ) : null ;
    };
    //handle opening the form
    const openConfirmFillingPanel = (rowData) => {
        setSelectedRefillRequest(rowData);
        setIsConfirmFillingVisible(true);
    };

    //handle the add new patient record form submission
    const handleConfirmFillingSubmit = async (formData) => {
        const fillQuantity = formData.quantity;
        await updateRefillRequestStatus(selectedRefillRequest._id, 'Ready', fillQuantity);
        setIsConfirmFillingVisible(false);
    };

    const renderRefillRequestsTable = (statusFilter) => {
        const filteredRequests = refillRequests.filter(req => req.status === statusFilter);
    
        return (
            <DataTable value={filteredRequests} filters={filters} globalFilterFields={['patientDetails.firstName', 'medicationId.name']} header={header} emptyMessage="No medication found."
            tableStyle={{ minWidth: '30rem', maxWidth: "100rem"}}>
                <Column field="requestDate" header="Request Date" body={renderDate} />
                <Column field="patientDetails.firstName" header="Patient Name" body={(rowData) => `${rowData.patientDetails.firstName} ${rowData.patientDetails.lastName}`} />
                <Column field="patientDetails.dateOfBirth" header="DOB" body={(rowData) => rowData.patientDetails.dateOfBirth ? new Date(rowData.patientDetails.dateOfBirth).toLocaleDateString() : ''} />
                <Column field="medicationId.name" header="Medication Name" />
                <Column field="medicationId.dosage" header="Dosage" />
                <Column field="fillQuantity" header={statusFilter === 'Balance' ? 'Balance Quantity' : 'Fill Quantity'} />
                {statusFilter === 'Ready'
                    ? <Column header="Action" body={completeRefillButtonTemplate} />
                    : <Column header="Action" body={fillRefillButtonTemplate} />}
            </DataTable>
        );
    };
    //keep track of badge
    const getFillingCount = () => {
        return refillRequests.filter(req => req.status === 'Filling').length;
    };
    const getReadyCount = () => {
        return refillRequests.filter(req => req.status === 'Ready').length;
    };
    const getBalanceCount = () => {
        return refillRequests.filter(req => req.status === 'Balance').length;
    };
    
    return (
        <div className="'product-card'">
            <div className="flex flex-wrap gap-2 mb-3">
                <Button className="button" onClick={() => setActiveIndex(0)}  label="Filling" >
                    <Badge value={getFillingCount()} className='badgeUrgent'></Badge>
                </Button>
                <Button className="button" onClick={() => setActiveIndex(1)} label="Pick-Up" >
                    <Badge value={getReadyCount()} className='badgeComplete'></Badge>
                </Button>
                <Button className="button" onClick={() => setActiveIndex(2)} label="Balance Owed" >
                    <Badge value={getBalanceCount()} className='badgeUrgent'></Badge>
                </Button>
                <Dialog header="Confirm Filling" className="dialog-background" visible={isConfirmFillingVisible} 
                modal onHide={() => setIsConfirmFillingVisible(false)} style={{ width: '50vw', height:'50vh' }} >
                    <ConfirmFillingPanel fillingRequestData={selectedRefillRequest}  onSubmit={handleConfirmFillingSubmit} />
                </Dialog>
            </div>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Rx in Filling">
                    {renderRefillRequestsTable('Filling')}
                </TabPanel>
                <TabPanel header="Rx for Pick up">
                    {renderRefillRequestsTable('Ready')}
                </TabPanel>
                <TabPanel header="Rx Balance Owed">
                    {renderRefillRequestsTable('Balance')}
                </TabPanel>
            </TabView>
        </div>
    )
}
        