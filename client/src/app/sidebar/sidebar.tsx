import styles from './sidebar.module.css';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ReceiptSVG, UsersSVG, UserSVG, LogoSVG } from '../svgloader/svgloader';

/* eslint-disable-next-line */
export interface SidebarProps { }

export function Sidebar(props: SidebarProps) {
  return (
    <div className={styles['sidebar-wrapper']}>
      <div className={styles['sidebar']} data-test-id={'sidebar'}>
        <div className={styles['upper']}>
          <div className={styles['sidebar-header']}>
            <LogoSVG width={25} height={25} fill={styles['componentColor']} />
            <h2>Ticketing App</h2>
          </div>
          <SidebarButton to={'/'} title={'Tickets'} icon={<ReceiptSVG width={25} height={25} fill={styles['componentColor']} />}></SidebarButton>
          <SidebarButton to={'/users'} title={'Users'} icon={<UsersSVG width={25} height={25} fill={styles['componentColor']} />} ></SidebarButton>
        </div>
        <div className={styles['lower']}>
          <UserSVG width={25} height={25} fill={styles['componentColor']} />
          <h2>Admin</h2>
        </div>

      </div>

    </div>
  );
}

interface SidebarButtonProps {
  to: string;
  title: string;
  icon: JSX.Element;
}

function SidebarButton(props: SidebarButtonProps) {
  return (
    <NavLink to={props.to} className={({ isActive }) => isActive ? `${styles['sidebar-link']} ${styles['sidebar-active']} active` : styles['sidebar-link']}
      data-test-id={'sidebar-link'}
    >
      <div className={styles['sidebar-button']}>
        {props.icon}
        <p>{props.title}</p>
      </div>
    </NavLink>
  );

}

export default Sidebar;
