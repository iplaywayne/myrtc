import { render } from '@testing-library/react'


export const renderIgnoringUnstableFlushDiscreteUpdates = (component) => {
  const originalError = console.error;
  const error = jest.fn();
  console.error = error;
  const result = render(component);
  expect(error).toHaveBeenCalledTimes(1);
  expect(error).toHaveBeenCalledWith("Warning: unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.%s", expect.any(String));
  console.error = originalError;
  return result;
};