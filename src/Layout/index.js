import LeftMenu from "../components/LeftMenu";
import styled from 'styled-components';
import Login from "../components/Login";
import { useEffect, useState } from "react";

const Layout = ({children}) => {
    const [token, setToken] = useState();
    useEffect(()=>{
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
        }
    },[]);

    if(token) {
        return <Main>
            <LeftMenu setToken={setToken}/>
            <Pages>
                {children}
            </Pages>
        </Main>;
    }else{
       return <Main>
            <Login setToken={setToken}/>
        </Main>;
    }
};

export default Layout;

const Main = styled.div`
  display: flex;
  height: 100%;
  min-height: 100% !important;
  background-color: #181C2D;
`;
const Pages = styled.div`
  display: flex;
  background-color: #181C2D;
  width: 100%;
  height: 100%;
  min-height: 100% !important;
  overflow-y: scroll;
`;