import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'
import classNames from 'classnames';

const NavLink = ({children,href,matchstart,activeClassName,className}) => {

    const { asPath } = useRouter()
    const child = Children.only(children)
    const childClassName = className || ''

    //可以分成2种active的状态

    let is_match;

    if (matchstart === true) {
        is_match = (asPath.indexOf(href) == 0);
    }else {
        is_match = (asPath === href);
    }

    const fullClassName = (is_match)
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName

    return (
        <Link href={href}>
            {React.cloneElement(child,{className:classNames(child.props.className,fullClassName)})}
        </Link>
    )
}

NavLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  matchstart: PropTypes.bool,
}

NavLink.defaultProps = {
  activeClassName: 'active',
  href           : '',
  matchstart     : false
}


export default NavLink