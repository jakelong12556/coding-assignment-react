import { render } from '@testing-library/react';

import Users from './users';
import { User } from '@acme/shared-models';

describe('Users', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Users users={[]} selectedUser={null} isRefresh={false} callback={function (user: User | null): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
