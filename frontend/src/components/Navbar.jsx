import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import bgImage from '../assets/images/NIAimg.png';


const Navbar = ({ items }) => {
  return (
    <nav className="h-full w-full rounded-xl shadow-slate-200 shadow-customShadowStyle">
      <div className='h-auto w-full p-5 flex items-center justify-center'>
        <img src={bgImage} alt="" className="w-12 mr-3" />
        <p className='text-xs font-semibold'>NATIONAL IRRIGATION ADMINISTRATION</p>
      </div>
      
      <div className='flex flex-col p-2'>
        {items.map((item) => (
          <NavLink 
              key={item.label} 
              to={item.path}
              className='w-full h-auto flex items-center justify-start gap-2 px-3 py-3 text-xs rounded-3xl hover:bg-customFontColor hover:text-white transition-all duration-150'>
              {item.icon}  {item.label}
              </NavLink>
        ))}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired, // Ensure this matches how you're using it
    })
  ).isRequired,
};

export default Navbar;
