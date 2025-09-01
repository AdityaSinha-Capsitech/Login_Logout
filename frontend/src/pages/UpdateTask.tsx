import { mergeStyles, PrimaryButton, Stack, TextField } from '@fluentui/react'
import axios from 'axios';
import React from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';

//interface

export interface props {
    taskId: string,
    onPageChange: () => void,
    onUpdateTask: () => void
}

// class
const parentStackClass = mergeStyles({

    padding: '20px',
    width: 'auto',
    margin: " 0 auto",
    maxWidth: '1200px',
    minWidth: '340px'
});
const textStyles = ({
    field: {// for input text
        textAlign: 'left'
    },
    wrapper: {// for label text
        textAlign: 'left'
    },
    fieldGroup: {
        border:'none',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)'
    }
});

//----


const UpdateTask: React.FC<props> = ({ taskId, onPageChange, onUpdateTask }) => {
     
    const [TaskName, setTaskName] = React.useState<string>("");



    // functions
    const handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTaskName(newValue || "");
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`https://localhost:9000/api/Task/editByAdmin`, { TaskName: TaskName, id: taskId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setTaskName("");
            onPageChange();
            onUpdateTask();

            console.log("response", response);
        }
        catch (error) {
            console.log("error", error);
        }
    }


    // console.log("taskId", taskId);

    //----

    return (
        <Stack className={parentStackClass}>
            <TextField
                value={TaskName}
                onChange={handleChange}
                styles={textStyles}
                label="Task Name"
                placeholder="Update your task"
            />
            <PrimaryButton onClick={handleSubmit}
                styles={{ root: { marginBottom: '5px', marginTop: '10px' } }}
                text="Submit" type="Submit" />
        </Stack>
    )
}

export default UpdateTask