import { useState } from "react";
import styled from "styled-components";
import close from "../../assets/images/close.svg"
import { changePassword } from "../../actions/auth";


export const ChangePassword = ({setOpenChangePass}) => {
  const [error, setError] = useState('');
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
const handleChangePass = () =>{
    changePassword(oldPassword, newPassword, confirmNewPassword).then(()=> {
        localStorage.removeItem('token')
        window.location.reload();
    }).catch(err => {
        if(oldPassword && newPassword && confirmNewPassword){
            if(newPassword !== confirmNewPassword){
                setError('Confirm password is wrong');
            }else{
                setError('Old password is wrong');
            }
        }else{
            setError('Fields are required');
        }
    });
};
    return(

<Main>
    <LoginDiv>
        <Header>
            Change Password
        </Header>
        <CloseButton onClick={()=>setOpenChangePass(false)}>
            <img src={close} alt="close"/>
        </CloseButton>
        <Line/>
        <Content>
            {error ?
                <ErrorMessage>{error}</ErrorMessage>
                : null}
            <Row>
                <AddingForm>
                    <AddingNames>Old Password</AddingNames>
                    <AddingInput onChange={(e) => setOldPassword(e.target.value)} type="Password" />
                </AddingForm>
            </Row>
            <Row>
                <AddingForm>
                    <AddingNames>New Password</AddingNames>
                    <AddingInput onChange={(e) => setNewPassword(e.target.value)} type="Password"/>
                </AddingForm>
            </Row>
            <Row>
                <AddingForm>
                    <AddingNames>Confirm New Password</AddingNames>
                    <AddingInput onChange={(e) => setConfirmNewPassword(e.target.value)} type="Password"/>
                </AddingForm>
            </Row>
            <Row>
                <AddingButton onClick={() => handleChangePass()}>Save</AddingButton>
            </Row>
        </Content>
    </LoginDiv>
</Main>
    )
}

const Main = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: rgba(24, 28, 45, .4);
`;

const AddingNames = styled.p`
  font-family: Nexa Bold, serif;
  font-size: 14px;
  color: #A3AED0;
`;

const LoginDiv = styled.div`
  position: relative;
  width: 505px;
  display: flex;
  height: 500px;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid #558EFE;
  background: #181C2D;
  opacity: 1;
  padding: 24px;
  @media screen and (max-width: 570px){
  width: 300px;
  }
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  color: white;
  font-size: 18px;

`;

const CloseButton = styled.button`
  position: absolute;
  right: 24px;
  top: 24px;
  height: 35px;
  width: 35px;
  cursor: pointer;
  border: none;
  background: inherit;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #A3AED0;
  margin-top: 29px;
`;

const Content = styled.div`
  height: 100%;
  //background: wheat;
  padding: 24px 58px 24px 58px;
  @media screen and (max-width: 600px){
    padding: 0;
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 10px;
`;

const AddingInput = styled.input`
  border: 1px solid #558EFE;
  border-radius: 8px;
  background: rgba(29, 34, 55, 0.8);
  width: 100%;
  height: 48px;
  margin-top: 6px;
  color: #ffffff;
  ::placeholder{
    padding-left: 10px;
    font-size: 14px;
    color: #A3AED0;
  }
`;

const AddingForm = styled.form`
  width: 100%;
`;

const AddingButton = styled.button`
  height: 42px;
  width: 100%;
  font-size: 14px;
  color: #ffffff;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  border: 1px solid #558EFE;
  background: #558EFE;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
`;
const ErrorMessage = styled.span`
  color: red;
`;