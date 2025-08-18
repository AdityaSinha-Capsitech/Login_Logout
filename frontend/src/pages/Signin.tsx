import { ActionButton, Dropdown, mergeStyles, PrimaryButton, Stack, TextField } from '@fluentui/react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const dropdownStyles = {
    dropdown: {
        width: 300,
        marginBottom: '20px',
      
    },
   root: {// for input text
        textAlign: 'left'
    }
};


const textStyles = ({
    field: {// for input text
        textAlign: 'left'
    },
    wrapper: {// for label text
        textAlign: 'left'
    },
    fieldGroup: {
        border: 'none'
    }
});

const formStyles = mergeStyles({
    backgroundColor: '#e0dbdbff',
    padding: '90px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    border: '2px',
    width: '100%',
    borderRadius: '10px',

})

const Signin = () => {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: "select options",
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required("Required"),
            password: Yup.string().min(5, 'Invalid password').required('Required'),
            role: Yup.string().required("No selection")
        }),


// **** How It Works in Practice

// When this schema is passed to a form (like in Formik), it will:

// Check that email is a string, formatted like a valid email (e.g., user@example.com), and not empty.

// Check that password is a string of at least 5 characters and is not empty.

// Check that role is a string and is not empty (used for dropdown selections or roles like "admin", "user", etc.).

// If any field fails validation, Yup will return the error message provided in the method call (e.g., "Invalid email" or "Required").


        onSubmit: async(values) =>{
             try {
                const tokenResponse = await axios.post(`https://localhost:9000/login`,    
                    values
                );

                localStorage.setItem("token", tokenResponse.data.token);
                console.log("tokenResponse", tokenResponse);

                if(values.role === "User"){
                    navigate(`/todo`);
                }
                else{
                    navigate(`/adminPage`);
                }

            }
            catch (error) {
                alert(error);
                console.log("error:", error);
            }

            console.log("values:", values);
        },
    })

    const handleNavigation = () => {
        navigate(`/`);
    }

    console.log("formik:", formik);
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack className={formStyles}>
                <h1>Signin</h1>
                <TextField
                    styles={textStyles}
                    label="Email"
                    value={formik.values.email}
                    onChange={(event, options) => {
                        formik.setFieldValue('email', options)
                    }}
                    errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                    required />

                <TextField
                    styles={textStyles}
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={(event, options) => {
                        formik.setFieldValue('password', options)
                    }}
                    canRevealPassword
                    revealPasswordAriaLabel="Show password"
                    errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
                    required />
                <Dropdown

                    placeholder={formik.values.role}
                    label="Select Role"
                    options={[
                        { key: 'A', text: 'User' },
                        { key: 'B', text: 'Admin' }
                    ]}
                    required
                    selectedKey={formik.values.role}
                    onChange={(event, options) => {
                        formik.setFieldValue('role', options?.text)
                    }}
                    errorMessage={formik.touched.role && formik.errors.role ? formik.errors.role : ''}
                    styles={dropdownStyles}
                />
                <PrimaryButton styles={{root:{
                    marginBottom:'5px'
                    }
                }}
                 text="Submit" type="Submit" allowDisabledFocus />
                <ActionButton onClick={handleNavigation} iconProps={{ iconName: 'AddFriend' }} allowDisabledFocus>
                    Create account
                </ActionButton>
            </Stack>

        </form>
    )
}

export default Signin