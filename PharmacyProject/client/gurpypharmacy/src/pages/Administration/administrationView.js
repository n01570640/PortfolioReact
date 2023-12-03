import { TabView, TabPanel } from 'primereact/tabview';
import MedicationPanel from './subcomponents/adminMedicationPane';
import PharmacistPanel from './subcomponents/adminPharmacistPane';
import '../../App.css';

export default function AdministrationView(){
    return (
        <TabView className='product-card'>
            <TabPanel header="Pharmacists">
                <PharmacistPanel />
            </TabPanel>
            <TabPanel header="Medications">
                <MedicationPanel />
            </TabPanel>
        </TabView>
    );
}