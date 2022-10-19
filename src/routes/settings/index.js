import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import editIcon from '../../assets/images/editIcon.svg'
import userIcon from '../../assets/images/userIcon.svg'
import {ChangePassword} from "../../components/ChangePassword";
import {createUser, deleteUser, editUser, getRoles, getUser, getUsers} from "../../actions/user";
import deleteIcon from '../../assets/images/deleteIcon.svg'
import Currency from "../../components/Currency";
import Roles from "../../components/Role";
import CurrencyAdd from "../../components/Currency/CurrencyAdd";
import { ProfileContext } from "../../App";

export default function Settings() {

    const profile = useContext(ProfileContext);

    const [error, setError] = useState();
    const [roles, setRoles] = useState();
    const [users, setUsers] = useState();
    const [timezone] = useState(+(localStorage.getItem('timezone')));

    const [settingsPage, setSettingsPage] = useState(1);
    const [openChangePass, setOpenChangePass] = useState(false);

    const [addUserForm, setAddUserForm] = useState(false);
    const [editUserForm, setEditUserForm] = useState(false);

    const [addPassword, setAddPassword] = useState();
    const [confirmAddPassword, setConfirmAddPassword] = useState();
    const [addUsername, setAddUsername] = useState();
    const [addRole, setAddRole] = useState();

    const [editUsername, setEditUsername] = useState();
    const [editUserId, setEditUserId] = useState();
    const [editRole, setEditRole] = useState();
    const [deleteMessage, setDeleteMessage] = useState();
    useEffect(() => {
        getRoles().then((response) => {
            setRoles(response);
        })
        getUsers().then((response) => {
            setUsers(response);
        })
    }, [addUserForm, editUserForm, deleteMessage]);
    const handleAddUser = () => {
        let new_user = {
            role: addRole,
            username: addUsername,
            password: addPassword,
            confirmPassword: confirmAddPassword,
        }
        createUser(new_user, setError, setAddUserForm);
        getUsers().then((response) => {
            setUsers(response);
        })
    }


    const getUserInfo = (id) => {
        setEditUserForm(true);
        setAddUserForm(false);
        getUser(id).then((response) => {
            setEditUsername(response.username)
            setEditRole(response?.Role.id)
            setEditUserId(response.id)
        })
    }
    const handleEditUser = (id) => {
        let edit_user = {
            role: editRole,
            username: editUsername,
        }
        editUser(id, edit_user, setError, setEditUserForm)
        getUsers().then((response) => {
            setUsers(response);
        })
    }
    const handleDeleteUser = (id, setDeleteMessage) => {

        deleteUser(id, setDeleteMessage)
    }

    const hasPermission = (path) => {

        if (profile?.user?.role === "super admin" || profile?.user?.role === "Super Admin"){
            return true;
        }

        return profile?.user?.permissions.find(permissions => permissions.slug === path);
    };

    return (
        <Container>
            <Header>Settings</Header>
            <Tab>
                <Button onClick={() => setSettingsPage(1)}>General</Button>
                {hasPermission('settings_dashboard') ? <Button onClick={() => setSettingsPage(2)}>Dashboard</Button> : null}
                {hasPermission('currencies')?<Button onClick={() => setSettingsPage(3)}>Currencies</Button> : null}
                {hasPermission('users') ? <Button onClick={() => setSettingsPage(4)}>Admin</Button> : null}
                {hasPermission('roles') ? <Button onClick={() => setSettingsPage(5)}>Roles</Button> : null}
            </Tab>

            {/*General Settings */}
            {openChangePass && <ChangePassword setOpenChangePass={setOpenChangePass}/>}
            {settingsPage === 1 &&
                <TabContent>
                    <Row>
                        <TextHeader>Time Zone</TextHeader>
                        <ButtonDiv>
                            <Select onChange={(e) => {
                                localStorage.setItem('timezone', e.target.value)
                            }} defaultValue={timezone}>
                                <Option value="0">GMT +00</Option>
                                <Option value="1">GMT +01</Option>
                                <Option value="2">GMT +02</Option>
                                <Option value="3">GMT +03</Option>
                                <Option value="4">GMT +04</Option>
                                <Option value="5">GMT +05</Option>
                                <Option value="6">GMT +06</Option>
                                <Option value="7">GMT +07</Option>
                                <Option value="8">GMT +08</Option>
                                <Option value="9">GMT +09</Option>
                                <Option value="10">GMT +10</Option>
                                <Option value="11">GMT +11</Option>
                                <Option value="12">GMT +12</Option>
                                <Option value="-11">GMT -11</Option>
                                <Option value="-10">GMT -10</Option>
                                <Option value="-9">GMT -9</Option>
                                <Option value="-8">GMT -8</Option>
                                <Option value="-7">GMT -7</Option>
                                <Option value="-6">GMT -6</Option>
                                <Option value="-5">GMT -5</Option>
                                <Option value="-4">GMT -4</Option>
                                <Option value="-3">GMT -3</Option>
                                <Option value="-2">GMT -2</Option>
                                <Option value="-1">GMT -1</Option>
                            </Select>
                        </ButtonDiv>
                    </Row>
                    <Line/>
                    <Row>
                        <TextHeader>Language</TextHeader>
                        <ButtonDiv>
                            <Select disabled>
                                <Option value="eng">English</Option>
                                <Option value="am">Armenian</Option>
                                <Option value="ru">Russian</Option>
                                <Option value="ko">Korean</Option>
                            </Select>

                        </ButtonDiv>
                    </Row>
                    <Line/>
                    <Row>
                        <TextHeader>
                            Password<br/>
                            ..........
                        </TextHeader>
                        <ChangeButton onClick={() => {
                            setOpenChangePass(true)
                        }}>Change</ChangeButton>
                    </Row>
                    <Line/>
                </TabContent>}
            {hasPermission('settings_dashboard') && settingsPage === 2 && <Currency/>}
            {hasPermission('currencies') && settingsPage === 3 && <CurrencyAdd/>}
            {hasPermission('users') && settingsPage === 4 && <TabContent>
                    {deleteMessage ?
                        <ErrorMessage>{deleteMessage}</ErrorMessage>
                        : null}
                    {users && users.map((item, key) => {
                        return <ExistingUser key={key}>
                            <img src={userIcon} alt={"img"}/>
                            <Name>{item.username} <br/> <Role>{item?.Role?.name}</Role> </Name>
                            {item?.Role.id === 1 ? "" :<EditIcon onClick={() => getUserInfo(item.id)}>
                                <img src={editIcon} alt="icon"/>
                            </EditIcon>}
                            {item?.Role.id === 1 ? "" :
                                <DeleteIcon onClick={() => handleDeleteUser(item.id, setDeleteMessage)}>
                                    <img src={deleteIcon} alt="icon"/>
                                </DeleteIcon>}
                        </ExistingUser>
                    })}

                    <AddUser onClick={() => setAddUserForm(true) || setEditUserForm(false)}>
                        <img src={userIcon} alt={"img"}/> <br/>
                        <AddUserText>+ Add User</AddUserText>
                    </AddUser>


                    {addUserForm && <AddingUser>
                        <UserText>Adding User</UserText>
                        {error ?
                            <ErrorMessage>{error}</ErrorMessage>
                            : null}
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Username</AddingNames>
                                <AddingInput onChange={(e) => setAddUsername(e.target.value)} type="text"/>
                            </AddingInputs>
                            <AddingInputs>
                                <AddingNames>Role</AddingNames>
                                <AddingSelect onChange={(e) => setAddRole(e.target.value)}>
                                    <Option key={0}/>
                                    {roles && roles.map((item, key) => {
                                        return <Option value={item.id} key={key}>{item.name}</Option>
                                    })}
                                </AddingSelect>
                            </AddingInputs>
                        </AddingRow>
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>One Time Password</AddingNames>
                                <AddingInput onChange={(e) => setAddPassword(e.target.value)} type="Password"/>
                            </AddingInputs>
                            <AddingInputs>
                                <AddingNames>Confirm One Time Password</AddingNames>
                                <AddingInput onChange={(e) => setConfirmAddPassword(e.target.value)} type="Password"/>
                            </AddingInputs>
                        </AddingRow>
                        <AddingCenteredRow>
                            <ButtonDiv>
                                <AddingButton onClick={() => handleAddUser()}>Create User</AddingButton>
                            </ButtonDiv>
                        </AddingCenteredRow>
                    </AddingUser>
                    }

                    {/*Editing User Part*/}

                    {editUserForm && <EditingUser>
                        <UserText>Edit User</UserText>
                        <EditingRow>
                            <EditingInputs>
                                <EditingNames>Username</EditingNames>
                                <EditingInput onChange={(e) => setEditUsername(e.target.value)} type="text"
                                              defaultValue={editUsername}/>
                            </EditingInputs>
                            <EditingInputs>
                                <EditingNames>Role</EditingNames>
                                <EditingSelect onChange={(e) => setEditRole(e.target.value)} name="role"
                                               value={editRole}>
                                    <Option key={0}/>
                                    {roles && roles.map((item, key) => {
                                        return <Option value={item.id} key={key}>{item.name}</Option>
                                    })}
                                </EditingSelect>
                            </EditingInputs>
                        </EditingRow>
                        <EditingCenteredRow>
                            <ButtonDiv>
                                <EditingButton onClick={() => handleEditUser(editUserId)}>Edit User</EditingButton>
                            </ButtonDiv>
                        </EditingCenteredRow>
                    </EditingUser>}
                </TabContent>}
            {hasPermission('roles') ? settingsPage === 5 && <Roles/> : null}
        </Container>
    )
}

const UserText = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  color: white;
  font-size: 16px;
  left: 15px;
`;

const AddingButton = styled.button`
  height: 42px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  margin-top: 6px;
  border: 1px solid #558EFE;
  background: #558EFE;
  border-radius: 8px;
`;

const AddingSelect = styled.select`
  width: 100%;
  height: 50px;
  padding-left: 10px;
  font-size: 14px;
  color: #A3AED0;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  margin-top: 6px;
  background-color: #1c2234;
  border: 1px solid #558EFE;
  @media screen and (max-width: 440px) {
    width: 90px;
  }

  border-radius: 8px;

  ::placeholder {
    padding-left: 10px;
    font-size: 14px;
    color: #A3AED0;
  }
`;

const AddingNames = styled.p`
  font-family: Nexa Bold, serif;
  font-size: 14px;
  color: #A3AED0;
  max-height: 20px;
  height: 20px;
  margin: 0;
`;

const AddingInput = styled.input`
  border: 1px solid #558EFE;
  border-radius: 8px;
  background: rgba(29, 34, 55, 0.8);
  width: 100%;
  height: 48px;
  margin-top: 6px;
  padding-left: 10px;
  color: #ffffff;
  @media screen and (max-width: 440px) {
    width: 80px;
  }

  ::placeholder {
    margin: 0;
    font-size: 14px;
    color: #A3AED0;
  }
`;

const AddingInputs = styled.div`
  width: 47%;
`;

const AddingUser = styled.div`
  display: flex;
  padding: 52px 28px 42px 28px;
  background: #131620;
  width: 95%;
  position: relative;
  border-radius: 12px;
  margin-top: 25px;
  flex-direction: column;
  @media screen and (max-width: 440px) {
    width: 200px;
    padding: 16px 16px 10px 22px;
  }
`;
const AddingRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
`;

const AddingCenteredRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 20px;
`;

const ExistingUser = styled.div`
  display: flex;
  width: 95%;
  height: 100px;
  border-radius: 12px;
  background: #131620;
  padding: 16px 28px 16px 28px;
  position: relative;
  margin-top: 20px;
  @media screen and (max-width: 440px) {
    font-size: 10px;
    width: 200px;
    padding-left: 10px;
  }
`;

const AddUserText = styled.p`
  font-weight: 300;
  font-size: 14px;
  color: #A3AED0;
`;

const AddUser = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  justify-content: center;
  margin-top: 36px;
  width: 95%;
  height: 100px;
  padding: 12px 28px 2px 28px;

  background: #131620;
  border-radius: 12px;
  @media screen and (max-width: 440px) {
    font-size: 10px;
    width: 200px;
    padding: 12px 16px 12px 22px;
  }
`;

const EditIcon = styled.div`
  display: flex;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 40px;
`;

const DeleteIcon = styled.div`
  display: flex;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Role = styled.p`
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #A3AED0;
  @media screen and (max-width: 440px) {
    font-size: 12px;
  }
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  padding-left: 32px;
  padding-top: 16px;
  @media screen and (max-width: 440px) {
    font-size: 14px;
    padding-left: 16px;
  }
`;

const ChangeButton = styled.button`
  color: #558EFE;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  background-color: transparent;
  display: flex;
  cursor: pointer;
  padding: 14px 15px;
  margin: 0 20px;
  transition: 0.3s;
  float: left;
  border: 0;
  @media screen and (max-width: 700px) {
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  padding: 0 0 0 30px;
  width: 100%;
  height: 100%;
  min-height: 100% !important;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 4px;
    height: 30px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(221 223 229 / 10%);
    border-radius: 5px;
  }
`;

const Header = styled.div`
  margin-top: 30px;
  display: flex;
  font-weight: bold;
  font-size: 32px;
  color: #ffffff;
`;

const Tab = styled.div`
  margin-top: 30px;
  display: flex;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
`;

const Button = styled.button`
  background-color: transparent;
  display: flex;
  font-family: "Nexa Bold", serif;
  cursor: pointer;
  padding: 14px 5px;
  margin: 0 20px;
  transition: 0.3s;
  font-size: 17px;
  float: left;
  border: 0;
  color: #ffffff;
  @media screen and (max-width: 600px) {
    align-items: center;
    width: 130px;
    padding: 14px 0 14px 0;
    margin: 0;
  }

  :hover {

    border-bottom: 3px solid #558EFE;
    border-radius: 4px;
  }

  :focus {
    border-bottom: 3px solid #558EFE;
    border-radius: 4px;
  }
`;

const TextHeader = styled.div`

`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 30px 0 30px 0;
  flex-direction: column;
`;

const Row = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 16px;
  color: #A3AED0;
  display: flex;
  justify-content: space-between;
  width: 95%;
  height: 100px;
  @media screen and (max-width: 700px) {
    flex-direction: column;

  }
`;
const Line = styled.div`
  background-color: #A3AED0;
  height: 1px;
  width: 95%;
`;

const ButtonDiv = styled.div`
  width: 329px;
  height: 48px;
  align-items: center;
`;
const Select = styled.select`
  width: 100%;
  height: 100%;
  padding: 16px 20px;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: #A3AED0;
  background-color: #1c2234;
  cursor: pointer;
  border: 1px solid rgba(163, 174, 208, 0.2);
  border-radius: 8px;
  @media screen and (max-width: 700px) {
    max-width: 200px;
  }
`;

const Option = styled.option`
`;

const EditingButton = styled.button`
  height: 42px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  margin-top: 6px;
  border: 1px solid #558EFE;
  background: #558EFE;
  border-radius: 8px;
`;

const EditingSelect = styled.select`
  width: 100%;
  height: 50px;
  padding-left: 10px;
  font-size: 14px;
  color: #A3AED0;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  margin-top: 6px;
  background-color: #1c2234;
  border: 1px solid #558EFE;
  @media screen and (max-width: 440px) {
    width: 90px;
  }

  border-radius: 8px;

  ::placeholder {
    padding-left: 10px;
    font-size: 14px;
    color: #A3AED0;
  }
`;

const EditingNames = styled.p`
  font-family: Nexa Bold, serif;
  font-size: 14px;
  color: #A3AED0;
  max-height: 20px;
  height: 20px;
  margin: 0;
`;

const EditingInput = styled.input`
  border: 1px solid #558EFE;
  border-radius: 8px;
  background: rgba(29, 34, 55, 0.8);
  width: 100%;
  height: 48px;
  margin-top: 6px;
  padding-left: 10px;
  color: #ffffff;
  @media screen and (max-width: 440px) {
    width: 80px;
  }

  ::placeholder {
    margin: 0;
    font-size: 14px;
    color: #A3AED0;
  }
`;

const EditingInputs = styled.div`
  width: 47%;

`;

const EditingUser = styled.div`
  display: flex;
  position: relative;

  padding: 52px 28px 22px 28px;
  background: #131620;
  width: 95%;
  border-radius: 12px;
  margin-top: 25px;
  flex-direction: column;
  @media screen and (max-width: 440px) {
    width: 200px;
    padding: 16px 16px 10px 22px;
  }
`;
const EditingRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
`;

const EditingCenteredRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 20px;
`;
const ErrorMessage = styled.span`
  color: red;
`;