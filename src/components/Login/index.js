import styled from "styled-components";
import bitIcon from "../../assets/images/bitIcon.svg";
import headerTitle from "../../assets/images/headerTitle.svg";
import {useState} from "react";
import {login} from "../../actions/auth"

const Login = ({ setToken }) => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState();
    return (
        <Container>
            <Header>
                <img src={bitIcon} alt="icon" height={"120px"}/>
                <HeaderTitle>
                    <img src={headerTitle} alt="title" width={'120px'}/>
                </HeaderTitle>
            </Header>
            <Body>
                <Form>
                    <FormTitle>Log In</FormTitle>
                    <GreyLine/>
                    <Inputs>
                        {error ?
                            <ErrorMessage>Username or password wrong</ErrorMessage>
                            : null}
                        <Username>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" onChange={(e)=>{setUsername(e.target.value)}}/>
                        </Username>
                        <Password>
                            <label htmlFor="pass">Password</label>
                            <input type="password" id="pass" onChange={(e)=>{setPassword(e.target.value)}}/>
                        </Password>
                        <ConfigRow>
                            <CheckBox>
                                <input type="checkbox"/>
                                Remember&nbsp;me
                            </CheckBox>
                        </ConfigRow>
                        <Button onClick={() => {login(username, password, setToken, setError)}}>Submit</Button>
                    </Inputs>
                </Form>
            </Body>
        </Container>
    );
}
export default Login;
const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
`;
const HeaderTitle = styled.div`
  margin-left: 10px;
  margin-top: 15px;
`;
const Body = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Form = styled.div`
  background: #131620;
  width: 505px;
  border-radius: 12px;
`;
const FormTitle = styled.div`
  padding: 32px 32px 0 32px;
  display: flex;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #FFFFFF;
`;
const GreyLine = styled.div`
  margin: 25px;
  opacity: 0.2;
  border: 1px solid #A3AED0;
`;
const Inputs = styled.div`
  margin: 25px 58px 32px 58px;
`;
const Username = styled.div`
  > label {
    font-family: Nexa Bold, serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    color: #A3AED0;
    margin: 10px 0;
  }

  > input {
    width: 100%;
    color: #A3AED0;
    border: 1px solid #558EFE;
    box-sizing: border-box;
    border-radius: 8px;
    background: rgba(29, 34, 55, 0.8);
    height: 48px;
    padding: 20px;

    :focus {
      outline: none !important;
      border: 1px solid #558EFE;
      color: #A3AED0;
      font-weight: 200;
    }
  }
`;
const Password = styled.div`
  margin-top: 23px;

  > label {
    font-family: Nexa Bold, serif;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    color: #A3AED0;
    margin: 10px 0;
  }

  > input {
    width: 100%;
    color: #A3AED0;
    border: 1px solid #558EFE;
    box-sizing: border-box;
    border-radius: 8px;
    background: rgba(29, 34, 55, 0.8);
    height: 48px;
    padding: 20px;

    :focus {
      outline: none !important;
      border: 1px solid #558EFE;
      color: #A3AED0;
      font-weight: 200;
    }

    :active {
      outline: none !important;
      border: 1px solid #558EFE;
      color: #A3AED0;
      font-weight: 200;
    }
  }
`;
const Button = styled.button`
  margin-top: 40px;
  background: #558EFE;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  height: 42px;
  cursor: pointer;

  :active {
    outline: none !important;
    color: #FFFFFF;
    font-size: 15px;
  }
`;
const ConfigRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Nexa Light, serif;
  font-style: normal;
  font-weight: 200;
  font-size: 12px;
  line-height: 21px;
  align-items: center;
  color: #A3AED0;
  padding-top: 22px;
`;
const CheckBox = styled.div`
display: flex;
`;
const ErrorMessage = styled.span`
  color: red;
`;