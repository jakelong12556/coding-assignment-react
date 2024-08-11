import { render } from '@testing-library/react';

import SVGLoader from './svgloader';

describe('SVGLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SVGLoader />);
    expect(baseElement).toBeTruthy();
  });
});
