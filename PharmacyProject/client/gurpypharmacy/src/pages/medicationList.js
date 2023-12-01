//importing react components
import { useState, useEffect } from 'react';
//importing primereact component
import { DataTable } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
//importing styles
import '../App.css';

export default function MedicationList(){
    const [ medications , setMedications ] = useState([]);
    //setting filters
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        dosage: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        price: { value: null, matchMode: FilterMatchMode.EQUALS },
        requiresPrescription: {value: null, matchMode: FilterMatchMode.EQUALS}
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    //Fetching the medication data from backend point "/api/medications"
    const fetchMedicationData = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/medications");
            //console.log(response);
            const data = await response.json();
            // console.log("DATA")
            // console.log(data);
            setMedications(data);
        } catch (error) {
            console.error("Error fetching medication data: ", error);
    }
     };
    useEffect(() => {fetchMedicationData()}, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
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

    const verifiedBodyTemplate = (rowData) => {
        return <i style={{width:"10", height: "200"}} className={classNames('pi', { 'true-icon pi-check-circle': rowData.requiresPrescription, 'false-icon pi-times-circle': !rowData.requiresPrescription })}></i>;
    };
    const verifiedRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    return(
        <div className="card" >
             <DataTable value={medications} dataKey="_id" filters={filters} filterDisplay="row" 
                 globalFilterFields={['name', 'dosage', 'description', 'price', 'requiresPrescription']} header={header} emptyMessage="No medication found."
                 tableStyle={{ minWidth: '30rem', maxWidth: "80rem"}}>
              <Column field="name" header="Name" filter filterPlaceholder="Search by name" filterField="name" sortable style={{ width: '25%' }}></Column>
              <Column field="dosage" header="Dosage" filter filterPlaceholder="Search by dosage" sortable style={{ width: '25%' }}></Column>
              <Column field="description" header="Description" filter filterPlaceholder="Search by description" style={{ width: '25%' }}></Column>
              <Column field="price" header="Price" sortable style={{ width: '25%' }}></Column>
              <Column field="quantityAvailable" header="On-hand Quantity" sortable style={{ width: '25%' }}></Column>
              <Column field="requiresPrescription" header="Requires Prescription" dataType='boolean' sortable style={{ width: '25%' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate}></Column>
            </DataTable>
        </div>
    );
}