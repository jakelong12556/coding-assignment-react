import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Sidebar from './sidebar';

describe('Sidebar', () => {

  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );  
    
    expect(baseElement).toBeTruthy();
  });


  // it('tickets should be active by default', () => {
  //   const { baseElement } = render(
  //     <BrowserRouter>
  //       <Sidebar />
  //     </BrowserRouter>
  //   );  
    
  //   expect(baseElement).toBeTruthy();
  // })

  // it('users should be active when clicked', () => {
  //   const { baseElement } = render(
  //     <BrowserRouter>
  //       <Sidebar />
  //     </BrowserRouter>
  //   );  
    
  //   expect(baseElement).toBeTruthy();
  // });
});


