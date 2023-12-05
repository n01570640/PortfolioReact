import {InputText, Password, Button, Toast } from 'primereact';
import React, { useRef, useState } from 'react';
//import 'primereact/resources/themes/saga-blue/theme.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';



/**
 * UserLogin - A functional component for handling user login.
 *
 * Manages state for user form data, navigation, and toast notifications.
 * Validates form data and handles the submission process including user authentication and routing based on user type.
 */
export default function UserLogin(){
    //initial state
    const [userFormData, setUserFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const toast = useRef(null);

    //Validate form fields
    const validateForm = () => {
        if(!userFormData.username.trim()){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Name is required'})
            return false;
        }
        if(userFormData.password.length < 8){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Password much be at least 8 characters long'})
        }
        return true; //if all validation pass
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Perform the validation
        const isFormValid = validateForm();
        if(!isFormValid) return; //if form is not valid, stop here

        try{
            const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: userFormData.username,
                password: userFormData.password,
            })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('userToken', data.token);
    
            const base64Url = data.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = atob(base64);
            const parsedToken = JSON.parse(payload);
            
            if(parsedToken.userType === 'Admin') {
                navigate('/admin');
            }
            else if (parsedToken.userType === 'Pharmacist') {
                navigate('/login/pharmacist-loggedin');
            } else if (parsedToken.userType === 'Patient') {
                navigate('/patient-view');
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Log-In Failed!'});
        }
        } catch (error) {
            console.error('Login error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occured'});
        }
  };
    return(
        
        <div className='product-card'>
           
           <Toast ref={toast} position="bottom-center" />
                <h2 className='brand-logo'>
                    User Log-In
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-field'>
                        <label htmlFor='username' className="form-label">Username</label>
                        <InputText className="form-input"  id="username" value={userFormData.name} onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='password' className="form-label">Password</label>
                        <Password id="password" className="form-password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value })} feedback={false} required/>
                    </div>
                    
                    <Button label="Log-In" className="button" />
                </form>
           
        </div>
    );

}