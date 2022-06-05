import classNames from 'classnames';

const Input = ({ field, form, color, className, has_error, ...props }) => {
   let c = 'input-box';
   if (className) {
      c = className;
   }
   return <input {...field} {...props} className={classNames(c,{"yellow":(color == 'yellow')},{"input-error":has_error})}/>;
};

export default Input;
 
