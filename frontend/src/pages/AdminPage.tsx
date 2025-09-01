import {
  TooltipHost, Announced, getTheme, DefaultButton, DetailsList, MarqueeSelection, mergeStyles, mergeStyleSets, PrimaryButton,
  Stack, Text, TextField, Toggle, type IColumn, Link, SelectionMode, getAllSelectedOptions, IconButton, DetailsListLayoutMode, Modal, type IStackProps, type IButtonStyles,
  ConstrainMode
} from '@fluentui/react'
import axios, { Axios } from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { useId, useBoolean, useForceUpdate } from '@fluentui/react-hooks';
import UpdateTask from './UpdateTask';




// export interface IDetailsListDocumentsExampleState {
//   columns: IColumn[];
//   items: IItem[];
//   selectionDetails: string;
//   isModalSelection: boolean;
//   isCompactMode: boolean;
// }

export interface props {
  setFlag: React.Dispatch<React.SetStateAction<boolean>>; // I did not understand this line
}

export interface IUser {
  Name: string,
  Email: string,
  Id: string
}

export interface IItem {
  key: string;
  TaskName: string;
  UserName: string;
  Status: string;
  UserId: string;
  Id: string;
  Users: IUser[];
}


//modal class

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    // color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },

};


//*** */
const buttonClass = mergeStyles({
  display: 'flex',
  width: '7em',
  justifyContent: 'center',
  placeItems: 'center',
  position: 'absolute',
  top: '2em',
  right: '2em'
});

const parentStackClass = mergeStyles({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '20px',
  width: '100%',
  margin: "0",
  maxWidth: '100vw',
  minWidth: '340px',
  borderRadius: '5px',
  position: 'relative'

});


const AdminPage = ({ setFlag }: props) => {

  const [items, setItems] = React.useState<IItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [taskId, setTaskId] = useState<string>("");

  const itemsPerPage = 10;

  const navigate = useNavigate();

  // const update = useForceUpdate();
  // useEffect(()=>{
  //    const onResize = ()=> update();
  
  //    window.addEventListener('resize',onResize);
  //    return ()=> window.removeEventListener('resize',onResize);
  
  // },[update])
  const handleLogout = () => {
    localStorage.removeItem('token');
    setFlag(false);
    navigate(`/signin`);
  }

  const handleEdit = (UserId: string) => {
    console.log("userID", UserId);
    setTaskId(UserId);
    showModal();
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("currentpage", currentPage);
  };

  const columns: IColumn[] = [

    {
      key: 'column1',
      name: 'Task Name',
      fieldName: 'taskName',
      // maxWidth: 800,
      minWidth: 70,
      //   isRowHeader: true,
      isResizable: true,
      //   isSorted: true,
      //   isSortedDescending: false,
      //   sortAscendingAriaLabel: 'Sorted A to Z',
      // sortDescendingAriaLabel: 'Sorted Z to A',

      data: 'string',
      onRender: (item: IItem) => {
        return (

          <Stack>{item.TaskName}</Stack>

        );
      },
      isPadded: true,
    },
    {
      key: 'column3',
      name: 'User Name',
      fieldName: 'userName',
      maxWidth: 800,
      minWidth: 70,
      isResizable: true,
      // onColumnClick: this._onColumnClick,
      data: 'number',
      onRender: (item: IItem) => {
        return <span>{item.Users[0].Name}</span>;
      },
      isPadded: true,
    },
    {
      key: 'column4',
      name: 'Status',
      fieldName: 'status',
      maxWidth: 800,
      minWidth: 70,
      isResizable: true,
      // isCollapsible: true,
      // data: 'string',
      // onColumnClick: this._onColumnClick,
      onRender: (item: IItem) => {
        return <span>{item.Status}</span>;
      },
      isPadded: true,
    },
    {
      key: 'column5',
      name: 'Action',
      fieldName: 'action',
      // maxWidth: 800,
      minWidth: 70,
      isResizable: true,
      // isCollapsible: true,
      // data: 'number',
      // onColumnClick: this._onColumnClick,
      onRender: (item: IItem) => {
        return (
          <Stack horizontal>
            <IconButton
              iconProps={{ iconName: 'Edit' }}
              title='Edit'
              ariaLabel='Edit'
              onClick={() => handleEdit(item.Id)}
            />

            <IconButton
              iconProps={{ iconName: 'Delete' }}
              title='Delete'
              ariaLabel='Delete'
            // onClick={() => handleDelete(item.Id)}
            />

          </Stack>

        )
      },
    },
  ];


  useEffect(() => {

    setFlag(true);
    const token = localStorage.getItem("token");

    const getAllTasks = async () => {
      try {
        const allTaskResponse = await axios.get("https://localhost:9000/api/Task/userTasksByAdmin", {
          headers: { Authorization: `bearer ${token}` }
        })

        console.log("allTaskResponse", allTaskResponse);

        const data: IItem[] = allTaskResponse.data;

        setItems(data);
        setTotalPages((Math.ceil(data.length / itemsPerPage)));


      }
      catch (error) {
        console.log("error", error);
      }
    }
    getAllTasks();
  },[])


  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems: IItem[] = items.slice(startIndex, startIndex + itemsPerPage);

  // const titleId = useId('title');

  // console.log("items length", items.length);
  // console.log("items", items);
  // console.log("currentItems",currentItems);
  // console.log("totalPage", totalPages);
  return (

    <Stack className={parentStackClass}>
      <DefaultButton iconProps={{ iconName: 'signout' }} className={buttonClass} text="Logout" onClick={handleLogout} />

      {/* admin page */}
      <Text>
        <h1> Admin page</h1>
        <h5>Get all details about users</h5>
      </Text>

      <MarqueeSelection selection={Selection}>
        <DetailsList
          items={currentItems}
          columns={columns}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified} // auto-resize
          compact={true}
        />
      </MarqueeSelection>


      {totalPages != 0 && <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />}


      {/* end */}





      <Modal
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false} // the background is not blocked; the user can click outside the modal or interact with other parts of the UI.

      >
        <Stack >
          <Stack horizontal horizontalAlign='center'
            style={{
              width: '100%',
              padding: '10px'
            }}
          >
            <Text styles={{
              root: {
                fontSize: '2em'
              }
            }}>
              Update form
            </Text>
            <IconButton
              styles={iconButtonStyles}
              iconProps={{ iconName: "cancel" }}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
          </Stack>
        </Stack>
        <UpdateTask
          taskId={taskId}
          onPageChange={hideModal}

        />
      </Modal>
    </Stack >
  )
}

export default AdminPage







// Notes *****
// 1) useForceUpdate: is a custom hook provided by Fluent UI that returns a function to force a React component to re-render.