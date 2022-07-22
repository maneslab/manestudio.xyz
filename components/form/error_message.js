
import { ErrorMessage } from 'formik';

const CustomErrorMessage = ({name}) => {  
    return <ErrorMessage name={name} render={msg => <div className='input-error-msg'>{msg}</div>} />
};

export default CustomErrorMessage; 