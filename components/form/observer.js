import { useEffect } from "react";
import { useFormikContext } from 'formik';

const FormObserver = ({onChange}) => {
    const { values } = useFormikContext();
    useEffect(() => {
    //   console.log("FormObserver::values", values , typeof onChange,onChange);
      if (typeof onChange == 'function') {
          onChange(values);
      }
    }, [values]);
    return null;
};

export default FormObserver;