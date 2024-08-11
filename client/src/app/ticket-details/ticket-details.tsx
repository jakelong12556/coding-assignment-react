import { useState, useEffect } from 'react';
import styles from './ticket-details.module.css';
import appStyle from '../app.module.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';
import UserSelector, { AssigneeHandler, AssigneeHandlerProps } from '../users/users';
import { SetTicketStatus, TicketStatus } from '../tickets/tickets';
import { Button } from '@mui/material';

/* eslint-disable-next-line */
export interface TicketDetailsProps {
  ticket: Ticket;
}

export function TicketDetails() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [assignee, setAssignee] = useState<User | null>(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { pathname } = useLocation()
  const navigate = useNavigate();



  useEffect(() => {
    getTicketDetails()
  }, []);

  async function getTicketDetails() {
    setIsRefresh(true);
    const ticket: Ticket = await fetch(`api/tickets${pathname}`).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Something went wrong');
    }).catch(err => {
      console.log(err);
    });

    if (ticket) {
      setTicket(ticket);
      if (ticket.assigneeId) {
        const user = await fetch(`api/users/${ticket.assigneeId}`).then(res => res.json());
        setAssignee(user);
      }

      const users = await fetch('api/users').then(res => res.json());
      setUsers(users);
    }
    setIsRefresh(false);
  }

  async function callbackSelectedUser(selectedUser: User | null) {

    //ignores cases where new assignee is the same as the old assignee
    if (!(selectedUser && assignee && assignee.id === selectedUser.id)) {
      if (ticket) {
        setIsRefresh(true);
        const assigneeProps: AssigneeHandlerProps = { oldAssignee: assignee, newAssignee: selectedUser, ticketId: ticket.id }
        console.log(assigneeProps)
        await AssigneeHandler(assigneeProps);
        await getTicketDetails();
        setIsRefresh(false);
      }
    }
  }

  async function callbackTicketStatus(complete: boolean) {
    if (ticket) {
      setIsRefresh(true);
      console.log(complete)
      await SetTicketStatus(ticket.id, complete);
      await getTicketDetails();
      setIsRefresh(false);
    }
  }

  const buttonStyle = {
    width: '100%',
    marginTop: '10px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderColor: '#e5e7eb',
    '&:hover': {
      backgroundColor: '#e5e7eb',
      borderColor: '#374151',
    }
  }


  return (
    ticket ? (<div className={styles['container']}>
      <div className={styles['sidebar']}>
        <h3 className={styles['sidebar-header']}>Assignee</h3>
        <div style={{ marginBottom: '1em' }}>
          <UserSelector users={users} selectedUser={assignee} isRefresh={isRefresh} callback={callbackSelectedUser} />
        </div>
        <div>
          <TicketStatus complete={ticket.completed} isRefresh={isRefresh} callback={callbackTicketStatus} />
        </div>
      </div>
      <div className={styles['ticket-body']}>
        <div className={styles['header']}>
          <div className={styles['header-title']}>
            <h1>Ticket Detail</h1>
            {isRefresh && <span className={appStyle['loader']}></span>}
          </div>
          <div>
            <Button className={styles['button']} onClick={() => navigate(-1)} variant='outlined' sx={buttonStyle}>Back</Button>
          </div>
        </div>
        <p>{ticket.description}</p>

      </div>

    </div>) : <div className={styles['loader-detail']}><span className={appStyle['loader']}></span></div>
  );
}

export default TicketDetails;
