import { useEffect, useState } from 'react';
import styles from './users.module.css';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { User } from '@acme/shared-models';

export interface AssigneeHandlerProps {
  oldAssignee: User | null;
  newAssignee: User | null;
  ticketId: number;
}

//handles cases null to user, user to null, user to user
export async function AssigneeHandler(props: AssigneeHandlerProps){

  //null to user
  if(props.oldAssignee === null && props.newAssignee){
    await fetch(`/api/tickets/${props.ticketId}/assign/${props.newAssignee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
  // user to null 
  if(props.oldAssignee && props.newAssignee === null){
    await fetch(`/api/tickets/${props.ticketId}/unassign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }

  //user to user
  if(props.oldAssignee && props.newAssignee){

    //unassign old assignee
    await fetch(`/api/tickets/${props.ticketId}/unassign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    //assign new assignee
    await fetch(`/api/tickets/${props.ticketId}/assign/${props.newAssignee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
}

export interface UsersProps {
  users: User[];
  selectedUser: User | null;
  isRefresh: boolean;
  callback: (user: User | null) => void;
}

export function UserSelector(props: UsersProps) {
  const [name, setName] = useState<string>(props.selectedUser? props.selectedUser.id.toString() : 'unselected');

  useEffect(() => {
    setName(props.selectedUser? props.selectedUser.id.toString() : 'unselected');
  },[props.selectedUser])

  const handleChange = (event: SelectChangeEvent) => {
    const user = props.users.find((u) => u.id === Number(event.target.value));
    if(user){
      setName(user.id.toString());
      props.callback(user);
    } else {
      setName('unselected');
      props.callback(null);
    }
  };
  
  return (
    <Box sx={{ minWidth: 120, width: '100%', display: 'flex' }}>
      <FormControl fullWidth size="small">
        <Select 
          labelId="simple-select-label"
          id="simple-select"
          onChange={handleChange}
          defaultValue={props.selectedUser? props.selectedUser.id.toString() : 'unselected'}
          value={name}
          disabled={props.isRefresh}
          data-test-id={'assignee-selector'}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem value={'unselected'} key={0} data-test-id={'assignee-unselected-option'}>{'Unassigned'}</MenuItem>
          {props.users.map((user) => { 
            return <MenuItem value={user.id} key={user.id} data-test-id={'assignee-option'}>{user.name}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Box>
  );
}

export default UserSelector;
