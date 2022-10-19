import styled from 'styled-components';
import bitIcon from '../../assets/images/bitIcon.svg';
import headerTitle from '../../assets/images/text_white.svg';
import dashboard from '../../assets/images/dashboard.svg';
import dashboardW from '../../assets/images/dashboardW.svg';
import monitoring from '../../assets/images/monitoring.svg';
import monitoringW from '../../assets/images/monitoringW.svg';
import transaction from '../../assets/images/transaction.svg';
import transactionW from '../../assets/images/transactionW.svg';
import logOut from '../../assets/images/logout.svg';
import settings from '../../assets/images/settings.svg';
import settingsW from '../../assets/images/settingsW.svg';
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileContext } from "../../App";

const LeftMenu = ({setToken}) => {
    const profile = useContext(ProfileContext);
    const location = useLocation();
    const [active, setActive] = useState();
    const logout = () => {
        localStorage.setItem('token', "");
        setToken('');
    }
    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);
    function hasPermission(path) {

        if (profile?.user?.role === "super admin" || profile?.user?.role === "Super Admin"){
            return true;
        }

        return profile?.user?.permissions.find(permissions => permissions.slug === path);
    };

    useEffect(()=>{
        if(profile.user){
            if (!hasPermission('dashboard')){
                if(hasPermission('monitoring')){
                    window.location.href = '/monitoring';
                } else if(hasPermission('transactions')) {
                    window.location.href = '/transactions';
                } else if(hasPermission('settings')) {
                    window.location.href = '/settings';
                } else {
                    window.location.href = '/404';
                }
            }
        }
    },[]);

    return (
        <Container>
            <Header>
                <img src={bitIcon} alt="icon" className='bitIcon' width={'80px'}/>
                <Title>
                    <img src={headerTitle} alt="title" width={'120px'}/>
                </Title>
            </Header>
            <Pages>
                {
                    hasPermission("dashboard") ? <Link to={"/"}>
                        <PageLink>
                            <DivImg>
                                <img src={active === '/' ? dashboardW : dashboard} alt="icon"/>
                            </DivImg>
                            <LinkTitle active={(active === '/' && 1) || 0}>Dashboard</LinkTitle>
                        </PageLink>
                    </Link> : null
                }
                {hasPermission("monitoring") ? <Link to={"/monitoring"}>
                    <PageLink>
                        <DivImg>
                            <img src={active === '/monitoring' ? monitoringW : monitoring} alt="icon" />
                        </DivImg>
                        <LinkTitle active={(active === '/monitoring' && 1) || 0}>Monitoring</LinkTitle>
                    </PageLink>
                </Link> : null}
                {hasPermission("transactions") ? <Link to={"/transaction"}>
                    <PageLinkTrans>
                        <DivImg>
                            <img src={active === '/transaction' ? transactionW : transaction} alt="icon" />
                        </DivImg>
                        <LinkTitle active={(active === '/transaction' && 1) || 0}>Transaction</LinkTitle>
                    </PageLinkTrans>
                </Link>:null}
                {hasPermission("settings") ? <Link to="/settings">
                    <PageLink>
                        <DivImg>
                            <img src={active === '/settings' ? settingsW : settings} alt="icon" width={'24px'}
                                 height={'20px'} />
                        </DivImg>
                        <LinkTitle active={(active === '/settings' && 1) || 0}>Settings</LinkTitle>
                    </PageLink>
                </Link>: null}
            </Pages>
            <LogOut onClick={logout}>
                <img src={logOut} alt="icon"/>
                <LinkTitle>Log Out</LinkTitle>
            </LogOut>
        </Container>

    );
}

export default LeftMenu;

const Container = styled.div`
  width: 290px;
  left: 0;
  top: 0;
  bottom: 0;
  background: #131620;
  padding: 28px 35px 0 30px;
  min-height: 100% !important;
  @media (max-width: 768px) {
    width: 50px;
  }
  @media screen and (max-width: 1120px) {
    width: 50px;
  }
  @media screen and (max-width: 900px) {
    padding: 25px 5px 0 5px;
  }
`;
const Header = styled.div`
  display: flex;
  @media screen and (max-width: 900px) {
    width: 25px;
  }
`;
const Title = styled.div`
  margin-left: 10px;
  margin-top: 15px;
  @media (max-width: 1120px) {
    display: none;
  }
`;
const Pages = styled.div`
  padding-left: 5px;

  & > a {
    text-decoration: none;
  }
`;
const PageLinkTrans = styled.div`
  display: flex;
  margin-top: 50px;
  cursor: pointer;
  align-items: center;
  ${({openSettings}) => openSettings ? 'zoom: 1.1' : ''};
  color: inherit;
  margin-left: -3px;

  :hover {
    zoom: 1.1;
  }

  @media screen and (max-width: 1120px) {
    width: 30px;
  }
  @media screen and (max-width: 900px) {
    width: 20px;
  }
`;
const PageLink = styled.div`
  display: flex;
  margin-top: 50px;
  cursor: pointer;
  align-items: center;
  ${({openSettings}) => openSettings ? 'zoom: 1.1' : ''};
  color: inherit;

  :hover {
    zoom: 1.1;
  }

  @media screen and (max-width: 1120px) {
    width: 30px;
  }
  @media screen and (max-width: 900px) {
    width: 20px;
  }
`;
const LinkTitle = styled.div`
  font-family: "Nexa Bold", serif;
  padding-left: 11px;
  color: ${({active}) => active ? '#FFFFFF' : '#A3AED0'};
  padding-right: 10px;

  @media screen and (max-width: 1120px) {
    display: none;
  }
`;
const DivImg = styled.div`
  width: 30px;
`;
const LogOut = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  padding-left: 5px;
  margin-bottom: 50px;
  cursor: pointer;
`;