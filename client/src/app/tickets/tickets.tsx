import { Ticket, User } from '@acme/shared-models';
import styles from './tickets.module.css';
import appStyle from '../app.module.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TicketsProps } from '../app';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {AssigneeHandler, UserSelector, AssigneeHandlerProps} from '../users/users';

export interface TicketsTableProps {
  tickets: TicketsProps[];
  users: User[];
  refreshTable: () => void;
  isRefresh: boolean;
}

export function TicketTable({ props }: { props: TicketsTableProps }) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'description', headerName: 'Description', flex: 150, sortable: false },
    { field: 'assigneeName', headerName: 'Assignee', width: 180 , cellClassName: styles['assignee-cell'], renderCell(params){
      const user = params.row.assigneeName;
      async function callback(selectedUser: User | null){

        //ignores cases where new assignee is the same as the old assignee
        if(!(selectedUser && user && user.id === selectedUser.id)){
          const assigneeProps : AssigneeHandlerProps = {oldAssignee: user, newAssignee: selectedUser, ticketId: params.row.id}
          await AssigneeHandler(assigneeProps);
          props.refreshTable();
        } 
      }
  
      return (<UserSelector users={props.users} selectedUser={user} callback={callback} isRefresh={props.isRefresh} />)
    }},
    { field: 'completed', headerName: 'Status', width: 160, type: 'boolean',  headerAlign: 'center', align: 'center', renderCell(params) {
      async function callback(complete: boolean){
        await SetTicketStatus(params.row.id, complete);
        props.refreshTable();
      }
      return (<TicketStatus complete={params.value} callback={callback} isRefresh={props.isRefresh}/>)
    }},
  ];
  const navigate = useNavigate();


  return (
    <div className={styles['tickets']} data-test-id={'tickets'}>
      <div className={styles['table-header']}>
        <NewTicketModal refreshTable={props.refreshTable} />
        {props.isRefresh && <span className={appStyle['loader']}></span>}
      </div>

      {props.tickets ? (

        <div style={{ height: '100%', width: '100%' }}>

          <DataGrid
            rows={props.tickets}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 15, 25]}
            onRowClick={(e) => { navigate(`/${e.row.id}`) }}
            sx={{ backgroundColor: 'white' }}
            

          />

        </div>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}

export default TicketTable;


interface NewTicketModalProps {
  refreshTable: () => void;
}

export function NewTicketModal(props: NewTicketModalProps) {
  const [formData, setFormData] = useState({ description: '' });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const buttonStyle = {
    width: '100%',
    marginTop: '10px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    '&:hover': {
      backgroundColor: '#d1d5db',
    }
  }

  async function CreateTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(res => res.json());
    console.log(data);

    props.refreshTable();
    handleClose();

  }


  return (
    <div>
      <button className={styles['new-ticket']} onClick={handleOpen} data-test-id={'new-ticket'}>Create New Ticket</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles['modal-header']}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create new ticket
            </Typography>
          </div>
          <form onSubmit={CreateTicket}>
            <TextField data-test-id={'description-field'} required id="outlined-basic" name="description" onChange={handleChange} value={formData.description} label="Description" variant="outlined" sx={{ width: '100%' }} />
            <Button variant="contained" sx={buttonStyle} type="submit" data-test-id={'submit-new-ticket'}>Create</Button>

          </form>

        </Box>
      </Modal>
    </div>
  );
}

export async function SetTicketStatus(ticketId: number, complete: boolean) {
  if(complete){
    await fetch(`/api/tickets/${ticketId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  } else {
    await fetch(`/api/tickets/${ticketId}/complete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

} 

/* eslint-disable-next-line */
export interface completedProps {
  complete: boolean;
  isRefresh: boolean;
  callback: (complete: boolean) => void;
}

export function TicketStatus(props: completedProps) {
  const [complete, setComplete] = useState<boolean>(props.complete);

  const handleChange = (event: SelectChangeEvent) => {
    const completeSelected = event.target.value === 'true';
    setComplete(completeSelected);
    props.callback(completeSelected);
  };
  
  return (
    <Box sx={{ minWidth: 120, width: '100%', display: 'flex' }}>
      <FormControl fullWidth size="small">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={complete? 'true' : 'false'}
          disabled={props.isRefresh}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem value={'true'} key={0}>{'Complete'}</MenuItem>
          <MenuItem value={'false'} key={1}>{'Incomplete'}</MenuItem>

        </Select>
      </FormControl>
    </Box>
  );
}

