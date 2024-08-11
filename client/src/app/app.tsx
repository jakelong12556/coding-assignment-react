import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';

import styles from './app.module.css';
import TicketTable from './tickets/tickets';
import Sidebar from './sidebar/sidebar';
import TicketDetails from './ticket-details/ticket-details';

export interface TicketsProps { 
  id: number;
  description: string;
  assigneeId: null | number;
  assigneeName: null | User;
  completed: boolean;
}


const App = () => {
  const [tickets, setTickets] = useState([] as TicketsProps[]);
  const [users, setUsers] = useState([] as User[]);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    getTicketTableData();
  }, []);


  async function getTicketTableData(){
    setIsRefresh(true);
    const tickets = await fetch('/api/tickets').then(res=> res.json());
    const users = await fetch('/api/users').then(res=> res.json());
    const data = DeserializeUserID(tickets, users);
    setTickets(data);
    setUsers(users);
    setIsRefresh(false);
  }

  function DeserializeUserID(tickets: Ticket[], users: User[]): TicketsProps[] {
    const res = tickets.map((ticket) => {
      const user = users.find((u) => u.id === ticket.assigneeId);
      return {
        id: ticket.id,
        description: ticket.description,
        assigneeId: ticket.assigneeId,
        assigneeName: user? user : null,
        completed: ticket.completed,
      };
    });    
    return res
    
  }  

  const tableProps = {
    tickets: tickets,
    users: users,
    refreshTable: getTicketTableData,
    isRefresh: isRefresh
  }

  return (
    <div className={styles['app']}>
      <div className={styles['app-wrapper']} data-test-id="app-wrapper">
        <Sidebar></Sidebar>
        <div className={styles['container']}>

          <Routes>
            <Route path="/" element={<TicketTable props={tableProps} />} />
            <Route path="/:id" element={<TicketDetails />} />
          </Routes>
        </div>
      </div>


    </div>
  );
};

export default App;
