import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, type IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { CommandBarButton, DefaultButton, IconButton } from '@fluentui/react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


//interface
interface IItem {
  Id: string;
  TaskName: string;
}

//class
const exampleChildClass = mergeStyles({
  boxShadow: '0 4px 2px rgba(0, 0, 0, 0.2)',
  padding: '20px',
  width: '100%',
  margin: "0",
  maxWidth: '100vw',
  minWidth: '340px',

  position: 'relative'
});

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

const buttonClass = mergeStyles({
  display: 'flex',
  border: '1px solid',
  justifyContent: 'center',
  position: 'absolute',
  top: '2em',
  right: '2em'
});

const temp = ({ setFlag }) => {

  const [items, setItems] = React.useState<IItem[]>([]);
  const [count, setCount] = React.useState(0);
  const [TaskName, setTaskName] = React.useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');

    try {
      const allTaskResponse = await axios.delete(`https://localhost:9000/api/Task/delete/${id}`, {
        params: {
          userId
        },
        headers: {
          Authorization: `bearer ${token}`
        }
      });
      const data: IItem[] = await allTaskResponse.data;
      console.log("data:", data)
      setItems(data)
      console.log("items", items);

      console.log("deleteResponse:", allTaskResponse);
    }
    catch (error) {
      console.log("error:", error);
    }
  }

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'TaskName',
      fieldName: 'TaskName',
      minWidth: 100,
      maxWidth: 1700,
      isResizable: false,
      onRender: (item) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1700px', minWidth: '10px', overflow: 'auto' }} >
            <span>{item.TaskName}</span>
            <div>
              <IconButton
                iconProps={{ iconName: 'Edit' }}
                title='Edit'
                ariaLabel='Edit'
              />
              <IconButton
                iconProps={{ iconName: 'Delete' }}
                title='Delete'
                ariaLabel='Delete'
                onClick={() => handleDelete(item.Id)}
              />
              <IconButton
                iconProps={{ iconName: 'ComplianceAudit' }}
                title='Details'
                ariaLabel='Details'
              />
            </div>
          </div>
        )
      }
    }
  ];



  // React.useEffect(()=>{
  //   // just connect with backend
  //   const getAllTaskByStatus = async () => {
  //     try {
  //       const statusTask = await axios.get(`https://localhost:9000/api/Task/status`,
  //         {
  //           params: {
  //             status: 'completed' 
  //           }
  //         }
  //       );
  //       console.log("statusTask:", statusTask);

  //       setItems(statusTask.data)
  //       setLoading(true)
  //     }
  //     catch (error) {
  //       console.log("error:", error);
  //     }
  //   }

  //   // getAllTaskByStatus();
  // },[])



  React.useEffect(() => {

    setFlag(true);
    const getAllTask = async () => {
      const token = localStorage.getItem('token');
      try {
        const allTaskResponse = await axios.get(`https://localhost:9000/api/Task`, {
          params: {
            userId
          },
          headers: {
            Authorization: `bearer ${token}`
          }
        });
        console.log("allTaskResponse:", allTaskResponse.data);
        const data: IItem[] = await allTaskResponse.data;
        // console.log("data:", data)
        setItems(data)
        // console.log("items", items);

      }
      catch (error) {
        alert(error + "  GO TO LOGIN PAGE");
        console.log("error:", error);
      }
    }

    const getTotalTask = async () => {
      const token = localStorage.getItem('token');

      try {
        const totalTask = await axios.get(`https://localhost:9000/api/Task/count`, {
          params: {
            userId
          },
          headers: {
            Authorization: `bearer ${token}`
          }
        });
        // console.log("totalTask:", totalTask);

        setCount(totalTask.data)

      }
      catch (error) {
        console.log("error:", error);
      }
    }


    // total count of the tasks
    getTotalTask();

    // get all the tasks
    getAllTask();

  }, [])

  const handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setTaskName(newValue || '');
  };

  const selection = React.useRef(
    new Selection({
      onSelectionChanged: () => {

      },
    })
  )

  const handleSubmit = async () => {

    if (TaskName === '') {
      return;
    }
    // console.log("Inputs:", TaskName)
    const token = localStorage.getItem('token');

    // Make a Api call
    try {
      const allTaskResponse = await axios.post(`https://localhost:9000/api/Task`, { TaskName: TaskName, UserId: userId },
        {
          headers: {
            Authorization: `bearer ${token}`
          }
        }
      );
      const data: IItem[] = await allTaskResponse.data;
      // console.log("data:", data)
      setItems(data);
      // console.log("items", items);
      // console.log("response:", allTaskResponse);
    }
    catch (error) {
      console.log("error:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setFlag(false);
    navigate(`/signin`);
  }

  // console.log("items updated:", items);
  // console.log("count:", count);

  return (
    <div className={exampleChildClass}>
      <DefaultButton iconProps={{ iconName: 'signout' }} className={buttonClass} text="Logout" onClick={handleLogout} />
      <div className={titleClass}>
        <TextField
          styles={{ fieldGroup: { border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', } }}
          label="Add your Todo"
          placeholder="Please enter task here"
          value={TaskName}
          onChange={handleChange}
        />
        <CommandBarButton
          iconProps={{ iconName: 'Add' }}
          styles={{
            root: { height: '32px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', },
          }}
          onClick={handleSubmit}

        />
      </div>

      <MarqueeSelection selection={selection.current}

      >
        {/* the <MarqueeSelection> component enables drag-to-select functionality within a list or grid.
          By wrapping your list component with <MarqueeSelection>,
            users can click and drag to select multiple items simultaneously. */}


        <DetailsList
          items={items}
          columns={columns}
          selection={selection.current}
          selectionMode={SelectionMode.none}
        />

        {/* How itmes and columns Work Together

Rendering: items provides the data rows, while columns instructs the table on how to display that data.

Field Mapping: Each column's fieldName must match a key in the items objects to display the correct data in each cell 
app.studyraid.com
.

If columns is missing or mismatched, the data may not render correctly, or it could default to something unintended */}

      </MarqueeSelection>


      <div className={titleClass}>
        <span>Total Tasks: {count}</span>
      </div>
    </div>
  )
}

export default temp