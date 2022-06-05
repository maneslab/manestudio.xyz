import { createConfirmation } from 'react-confirm';
import ConfirmModal from 'components/common/confirm/modal';

// create confirm function
export const confirm = createConfirmation(ConfirmModal);

// This is optional. But wrapping function makes it easy to use.
export function confirmWrapper(confirmation, options = {}) {
  return confirm({ confirmation, options });
}
