import { CommandBarButton, mergeStyles, Stack, TextField } from '@fluentui/react';
import { GoogleGenAI } from '@google/genai'
import React from 'react'




const titleClass = mergeStyles({
  display: 'flex',
  gap: '5px',
  alignItems: 'flex-end',
  justifyContent: 'center',
  marginBottom: '10px',
  maxWidth: '100%',
  // flexShrink:'1',
  // flexGrow:'1'
  // flex: "1 1 auto"
})


const ChatBot = () => {
    const [TaskName, setTaskName] = React.useState<string>("");

    const key = "AIzaSyDUAbgHX7DFyUQoq72q2F3RQFZCHRhN4Js";
    const ai = new GoogleGenAI({apiKey:key})

    const handleSearch = async() =>{
        try{
         const response = await ai.models.generateContent({
            model:"gemini-2.0-flash",
            contents:"Tell me something about India"
         });

         console.log("response",response);
        }catch(error){
            console.log("error:",error);
        }
    }

     const handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTaskName(newValue || '');
      };

  return (
    
    <Stack>
         <Stack className={titleClass}>
                <TextField
                  styles={{ fieldGroup: {border:'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',} }}
                  label="Add your Todo"
                  placeholder="Please enter task here"
                  value={TaskName}
                  onChange={handleChange}
                />
                <CommandBarButton
                  iconProps={{ iconName: 'Add' }}
                  styles={{
                    root: { height: '32px' ,boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',},
                  }}
                  onClick={handleSearch}
        
                />
              </Stack>
    </Stack>
  )
}

export default ChatBot