import { render } from '@testing-library/react';
import TicketDetails from './ticket-details';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


describe('TicketDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/:id" element={<TicketDetails />} />
        </Routes>
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
