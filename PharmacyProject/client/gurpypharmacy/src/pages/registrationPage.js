import {InputText, Password, Button, Toast } from 'primereact';
import React, { useRef, useState } from 'react';
//import 'primereact/resources/themes/saga-blue/theme.css';
import '../App.css';



/**
 * UserRegistration - A React functional component for handling user registrations.
 * 
 * State:
 *  - userFormData: An object that stores the user's name, email, password, and userType.
 * 
 * Refs:
 *  - toast: A reference to the Toast component used for showing feedback messages.
 * 
 * Functions:
 *  - validateForm: Validates the user input fields. Checks if the name field is not empty,
 *    validates the email format, and checks the minimum password length.
 * 
 *  - handleSubmit: An asynchronous function that is triggered when the registration form is submitted.
 *    It validates the form data, makes a POST request to the server with the user's data, and handles the response.
 *    On successful registration, it shows a success toast message and resets the form. 
 *    On failure, it shows an error toast message. Catches and logs any errors in the process.
 * 
 * Returns:
 *  - A registration form UI with input fields for name, email, and password, and a submit button.
 *    Displays toast messages for form validation feedback.
 */
export default function UserRegistration(){
    //initial state
    const [userFormData, setUserFormData] = useState({ name: "", email: "", password: "" , userType: ""});
    const toast = useRef(null);//For showing feedback message
    //Email validation regrex
    const emailRegex = /\S+@\S+\.\S+/;

    //Validate form fields
    const validateForm = () => {
        if(!userFormData.name.trim()){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Name is required', className: 'error-toast'});
            return false;
        }
        if(!emailRegex.test(userFormData.email)){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Enter a valid email', className: 'error-toast'});
            return false;
        }
        if(userFormData.password.length < 8){
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Password much be at least 8 characters long', className: 'error-toast'});
            return false;
        }
        return true; //if all validation pass
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Perform the validation
        const isFormValid = validateForm();
        if(!isFormValid) return; //if form is not valid, stop here

        try{
            userFormData.userType ='Patient';
            const response = await fetch('http://localhost:3001/register',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'  },
                body: JSON.stringify({ 
                    username: userFormData.email,
                    password: userFormData.password,
                    userType: userFormData.userType
                })
            });
            if(response.ok){
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration Successfull', className: 'success-toast'});
                setUserFormData({name: "" , email: "", password: "", userType: "" })
            }else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration Failed', className: 'error-toast'});
            }
        } catch (error) {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: '500: There was an internal server error. A team of highly skilled programmers will be dispatched to resolve the issue. WARNING: DO NOT TAP THE GLASS. They scare easily.', className: 'error-toast'});
        }
    };

    return(
        
        <div className='product-card'>
           
           <Toast ref={toast} position="bottom-center" />
                <h2 className='brand-logo'>
                    User Registration
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-field'>
                        <label htmlFor='name' className="form-label">Name</label>
                        <InputText className="form-input"  id="name" value={userFormData.name} onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='email' className="form-label">Email</label>
                        <InputText className="form-input" id="email" value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor='password' className="form-label">Password</label>
                        <Password id="password" className="form-password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value })} feedback={false} required/>
                    </div>
                    
                    <Button label="Register" className="button" />
                </form>
           
        </div>
    );

}