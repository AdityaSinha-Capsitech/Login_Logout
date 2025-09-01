import { ActionButton, Dropdown, mergeStyles, PrimaryButton, Stack, TextField } from '@fluentui/react'
import { useFormik } from 'formik';
import * as Yup from 'yup';

import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// class
const dropdownStyles = {
    dropdown: {
        marginBottom: '20px'
    },
    root: {// for input text
        textAlign: 'left',

    },
};

const textStyles = ({
    field: {// for input text
        textAlign: 'left'
    },
    wrapper: {// for label text
        textAlign: 'left'
    }
});

const formStyles = mergeStyles({
    padding: '3em 4em',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: 'auto',
    border: '2px',
    width: '100%',
    maxWidth: '400px',
    minWidth: '300px',
    height: 'fit-content',
    borderRadius: '5px',
})


const Signup = () => {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            role: "Select options"
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email('Invalid email').required("Required"),
            password: Yup.string().min(5, 'Make strong password').required('Required'),
            role: Yup.string().required("No selection")
        }),
        onSubmit: async (values) => {

            try {
                const tokenResponse = await axios.post(`https://localhost:9000/register`, values);

                localStorage.setItem("token", tokenResponse.data.token);
                console.log("items", tokenResponse);

                if (values.role === "User") {
                    navigate('/todo', { state: { userId: tokenResponse.data.users.Id } });
                }
                else {
                    navigate(`/adminPage`);
                }

            }
            catch (error) {
                alert(error)
                console.log("error:", error);
            }

            console.log("values:", values);

        }
    });

    const handleNavigation = () => {
        navigate(`/signin`);
    }


    console.log("formik:", formik);
    return (
        <Stack className={formStyles}>
            <form onSubmit={formik.handleSubmit}>
                <h1>Signup</h1>
                <TextField
                    styles={textStyles}
                    label="Name"
                    value={formik.values.name}
                    onChange={(event, option) => {
                        formik.setFieldValue('name', option);
                    }}
                    errorMessage={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                    required
                />
                <TextField
                    styles={textStyles}
                    label="Email "
                    value={formik.values.email}
                    onChange={(event, option) => {
                        formik.setFieldValue('email', option);
                    }}
                    errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                    required
                />
                <TextField
                    styles={textStyles}
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={(event, option) => {
                        formik.setFieldValue('password', option);
                    }}
                    canRevealPassword
                    revealPasswordAriaLabel="Show password"
                    errorMessage={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
                    required
                />
                <Dropdown
                    label='Role'
                    placeholder={formik.values.role}
                    ariaLabel="Select Role"
                    options={[
                        {
                            key: 'A', text: 'User',

                        },
                        { key: 'B', text: 'Admin' },

                    ]}
                    selectedKey={formik.values.role}
                    onChange={(event, option) => {
                        formik.setFieldValue('role', option?.text);
                    }}
                    errorMessage={formik.touched.role && formik.errors.role ? formik.errors.role : ""}
                    required
                    styles={dropdownStyles}
                />
                <PrimaryButton styles={{
                    root: {
                        margin: '10px'
                    }
                }}
                    text="Submit"
                    type="Submit"
                    allowDisabledFocus />
                <ActionButton styles={{
                    root: {
                        height: 'fit-content',
                        border: 'none',
                        selectors: {
                            ':hover': {
                                border: 'none'
                            },
                            ':focus': {
                                border: 'none',
                                outline: 'none'
                            },
                            ':active': {
                                boxShadow: 'none',
                                outline: 'none',

                            }
                        }
                    }
                }}

                    onClick={handleNavigation} iconProps={{ iconName: 'signin' }} >
                    Signin
                </ActionButton>
            </form >
        </Stack>


    )
}

export default Signup