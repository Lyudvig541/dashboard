import React, { useEffect, useState } from 'react';
import editIcon from "../../assets/images/editIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import styled from "styled-components";
import {
    getRoles, createRole, deleteRole, editRole, getRole, getPermissions
} from "../../actions/role";

const Roles = () => {
    const [error, setError] = useState();
    const [roles, setRoles] = useState();
    const [permissions, setPermissions] = useState();

    const [addUserForm, setAddUserForm] = useState(false);
    const [editUserForm, setEditUserForm] = useState(false);

    const [addName, setAddName] = useState();
    const [addPermissions, setAddPermissions] = useState([]);

    const [editName, setEditName] = useState();
    const [editRoleId, setEditRoleId] = useState();
    const [editPermissions, setEditPermissions] = useState([]);

    const [deleteMessage, setDeleteMessage] = useState();
    useEffect(() => {
        getPermissions().then((response) => {
            setPermissions(response);
        })
        getRoles().then((response) => {
            setRoles(response);
        })
    }, [addUserForm, editUserForm,deleteMessage]);
    const handleAddRole = () => {
        let new_role = {
            name: addName,
            permissions: addPermissions
        }
        createRole(new_role, setError, setAddUserForm);
        getRoles().then((response) => {
            setRoles(response);
        })
    }


    const getRoleInfo = (id) => {
        setEditUserForm(true);
        setAddUserForm(false);
        getRole(id).then((response) => {
            setEditName(response.name)
            setEditRoleId(response.id)
            const arr = [];
            response.permissions.forEach((permission) =>arr.push(permission.id))
            setEditPermissions(arr)
        })
    }
    const handleEditRole = (id) => {
        let edit_role = {
            name: editName,
            permissions: editPermissions,
        }
        editRole(id,edit_role,setError,setEditUserForm)
    }
    const handleDeleteRole = (id, setDeleteMessage) => {

        deleteRole(id,setDeleteMessage)

    }
    const handleAddPermissions = (check, id) => {
        if(check){
            setAddPermissions([...addPermissions, id]);
        }else{
            const arr = addPermissions;
            const index = arr.indexOf(id);
            if (index !== -1) {
                arr.splice(index, 1);
            }
            setAddPermissions(arr);
        }
    }
    const handleEditPermissions = (check, id) => {
        if(check){
            setEditPermissions([...editPermissions, id]);
        }else{
            setEditPermissions((editPermissions) =>{
                const index = editPermissions.indexOf(id);
                if (index !== -1) {
                    editPermissions.splice(index, 1);
                }
                return editPermissions;
            });
        }
    }
    return (<>
        <TabContent>
            {deleteMessage ?
                <ErrorMessage>{deleteMessage}</ErrorMessage>
                : null}
            {roles && roles.map((item, key) => {
                return <ExistingUser key={key}>
                    <Name>{item.name}</Name>
                    {item.id === 1 ? "" : <EditIcon onClick={()=>getRoleInfo(item.id)}>
                        <img src={editIcon} alt="icon"/>
                    </EditIcon>}
                    {item.id === 1 ? "" :<DeleteIcon onClick={()=>handleDeleteRole(item.id,setDeleteMessage)}>
                        <img src={deleteIcon} alt="icon"/>
                    </DeleteIcon>}
                </ExistingUser>
            })}

            <AddUser onClick={() => setAddUserForm(true) || setEditUserForm(false)}>
                <AddUserText>+ Add Role</AddUserText>
            </AddUser>

            {/*Adding User Part*/}

            {addUserForm && <AddingUser>
                <UserText>Adding Role</UserText>
                {error ?
                    <ErrorMessage>{error}</ErrorMessage>
                    : null}
                <AddingRow>
                    <AddingInputs>
                        <AddingNames>Name</AddingNames>
                        <AddingInput onChange={(e) => setAddName(e.target.value)} type="text"/>
                    </AddingInputs>
                </AddingRow>
                <AddingRowCheckbox>
                    {permissions.map((item)=><AddingCheckbox key={item.id}>
                        <Default type={'checkbox'} onChange={(e) => handleAddPermissions(e.target.checked, item.id)}/>
                        <AddingNames>{item.slug}</AddingNames>
                    </AddingCheckbox>)}
                </AddingRowCheckbox>
                <AddingCenteredRow>
                    <ButtonDiv>
                        <AddingButton onClick={() => handleAddRole()}>Create Role</AddingButton>
                    </ButtonDiv>
                </AddingCenteredRow>
            </AddingUser>
            }

            {/*Editing User Part*/}

            {editUserForm && <EditingUser>
                <UserText>Edit Role</UserText>
                <EditingRow>
                    <EditingInputs>
                        <EditingNames>Name</EditingNames>
                        <EditingInput onChange={(e) => setEditName(e.target.value)} type="text" defaultValue={editName}/>
                    </EditingInputs>
                </EditingRow>
                <AddingRowCheckbox>
                    {permissions.map((item)=><AddingCheckbox key={item.id}>
                        <Default type={'checkbox'} onChange={(e) => handleEditPermissions(e.target.checked, item.id)} checked={editPermissions.includes(item.id)}/>
                        <AddingNames>{item.slug}</AddingNames>
                    </AddingCheckbox>)}
                </AddingRowCheckbox>
                <EditingCenteredRow>
                    <ButtonDiv>
                        <EditingButton onClick={() => handleEditRole(editRoleId)}>Edit Role</EditingButton>
                    </ButtonDiv>
                </EditingCenteredRow>
            </EditingUser>}
        </TabContent>
    </>);
};

export default Roles;

const UserText = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  color: white;
  font-size: 16px;
  left: 15px;
`


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
  width: 100%;

`;
const AddingCheckbox = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;
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
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
`;
const AddingRowCheckbox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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
  height: 50px;
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

const Name = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  padding-top: 16px;
  @media screen and (max-width: 440px) {
    font-size: 14px;
    padding-left: 16px;
  }
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 30px 0 30px 0;
  flex-direction: column;
`;
const ButtonDiv = styled.div`
  width: 329px;
  height: 48px;
  align-items: center;
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
  width: 100%;

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
const Default = styled.input`
  border: 1px solid #558EFE;
  border-radius: 8px;
  background: rgba(29, 34, 55, 0.8);
  width: 20px;
  height: 20px;
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
