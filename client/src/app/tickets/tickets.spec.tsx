import { render } from '@testing-library/react';

import { TicketsTableProps, TicketTable } from './tickets';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


const props: TicketsTableProps = {
  tickets: [],
  users: [],
  refreshTable: refreshTable,
  isRefresh: false,
}

function refreshTable() {
  console.log('refreshing table');
}

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TicketTable props={props} />} />
        </Routes>
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
