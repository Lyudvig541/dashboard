import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import userIcon from "../../assets/images/userIcon.svg";
import editIcon from "../../assets/images/editIcon.svg";
import deleteIcon from "../../assets/images/deleteIcon.svg";
import {update,destroy,index,create,edit} from "../../actions/currency";

const CurrencyAdd = () => {
    const [addForm, setAddForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [currenciesAll, setCurrenciesAll] = useState([]);
    const [message, setMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    useEffect(()=>{
        index().then((data) => {
            setCurrenciesAll(data);
        })
        setMessage('')
        setDeleteMessage('')
    },[message,deleteMessage]);
    const [error, setError] = useState();
    const [currencies, setCurrencies] = useState([]);
    const [newCurrency, setNewCurrency] = useState({
        name: '',
        code: '',
        limit: '',
        chips: ''
    });
    const [editCurrency, setEditCurrency] = useState({
        id: '',
        name: '',
        code: '',
        limit: '',
        chips: ''
    });
    const [chips,setChips] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [editChips, setEditChips] = useState();
    const handleName = (value) => {
        setNewCurrency({...newCurrency, name: value});
    };
    const handleLimit = (value) => {
        setNewCurrency({...newCurrency, limit: value});
    };
    const handleCode = (value) => {
        setNewCurrency({...newCurrency, code: value});
    };
    const handleChips = (key, value) => {
        chips[--key] = value;
        let chipsResult =  chips.join('|');
        setNewCurrency({...newCurrency, chips: chipsResult});
    };
    const getCurrencyInfo = (id) => {
        setAddForm(false);
        edit(id).then((response) => {
            setEditForm(true);
            setEditChips(response.currency.chips.split('|'));
            setEditCurrency({id:response.currency.id,name: response.currency.name, limit: response.currency.limit, code: response.currency.code});
            setNewCurrency({id:response.currency.id,name: response.currency.name, limit: response.currency.limit, code: response.currency.code});
            setChips(response.currency.chips.split('|'))
        })
    }
    const addCurrency = () => {
        create(newCurrency, setError).then(data => {
            if (data) {
                setCurrencies([...currencies, data]);
                setNewCurrency({
                    name: '',
                    code: '',
                    limit: '',
                    chips: ''
                })
                setMessage('Currency added')
                setAddForm(false)
            } else {
                setMessage('')
            }

        });
    };
    const handleEditCurrency = (id) => {
        update(id,newCurrency).then(data => {
            if (data) {
                setCurrencies([...currencies, data]);
                setEditCurrency({
                    id: '',
                    name: '',
                    code: '',
                    limit: '',
                    chips: ''
                })
                setNewCurrency({
                    name: '',
                    code: '',
                    limit: '',
                    chips: ''
                })
                setMessage('Currency edited')
                setEditForm(false)
            } else {
                setMessage('')
            }

        });
    };

    const handleDeleteCurrency = (id,setMessage) => {
        destroy(id,setMessage)
    }
    useEffect(()=>{

    },[message,deleteMessage])
    return (<>
            <TabContent>
                {deleteMessage ?
                    <ErrorMessage>{deleteMessage}</ErrorMessage>
                    : null}
                {currenciesAll && currenciesAll.map((item, key) => {
                    return <ExistingUser key={key}>
                        <Name>{item.name} {item.code}</Name>
                        <EditIcon onClick={() => getCurrencyInfo(item.id)}>
                            <img src={editIcon} alt="icon"/>
                        </EditIcon>
                        <DeleteIcon onClick={() => handleDeleteCurrency(item.id,setDeleteMessage)}>
                                <img src={deleteIcon} alt="icon"/>
                            </DeleteIcon>
                    </ExistingUser>
                })}

                <AddUser onClick={() => setAddForm(true) || setEditForm(false)}>
                    <img src={userIcon} alt={"img"}/> <br/>
                    <AddUserText>+ Add Currency</AddUserText>
                </AddUser>
                {addForm && <AddingCurrency>
                    <UserText>Adding Currency</UserText>
                    {error ?
                        <ErrorMessage>{error}</ErrorMessage>
                        : null}
                    <AddCurrency>
                        <UserText>Add Currency</UserText>
                        {error ?
                            <ErrorMessage>{error}</ErrorMessage>
                            : null}
                        {message ?
                            <Message>{message}</Message>
                            : null}
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Symbol</AddingNames>
                                <AddingInput onChange={(e) => handleName(e.target.value)} value={newCurrency.name} type="text"/>
                            </AddingInputs>
                            <AddingInputs>
                                <AddingNames>Name</AddingNames>
                                <AddingInput onChange={(e) => handleCode(e.target.value)} value={newCurrency.code} type="text"/>
                            </AddingInputs>
                        </AddingRow>
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Limit</AddingNames>
                                <AddingInput onChange={(e) => handleLimit(e.target.value)} value={newCurrency.limit} type="text"/>
                            </AddingInputs>
                        </AddingRow>
                        <AddingRow>

                            <AddingInputs>
                                <AddingNames>Chips</AddingNames>
                                {
                                    chips.map((value, key) => {
                                        return <AddingInput key={key} onChange={(e) => handleChips(key, e.target.value)}
                                                            type="number" placeholder={`Chip ${++key}`}/>
                                    })
                                }
                            </AddingInputs>
                        </AddingRow>
                        <AddingCenteredRow>

                            <ButtonDiv>
                                <AddingButton onClick={addCurrency}>Add Currency</AddingButton>
                            </ButtonDiv>
                        </AddingCenteredRow>
                    </AddCurrency>
                </AddingCurrency>}
                {editForm && <EditCurrency>
                    <UserText>Edit Currency</UserText>
                    {error ?
                        <ErrorMessage>{error}</ErrorMessage>
                        : null}
                    <AddCurrency>
                        <UserText>Edit Currency</UserText>
                        {error ?
                            <ErrorMessage>{error}</ErrorMessage>
                            : null}
                        {message ?
                            <Message>{message}</Message>
                            : null}
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Symbol</AddingNames>
                                <AddingInput onChange={(e) => handleName(e.target.value)} defaultValue={editCurrency.name} type="text"/>
                            </AddingInputs>
                            <AddingInputs>
                                <AddingNames>Name</AddingNames>
                                <AddingInput onChange={(e) => handleCode(e.target.value)} defaultValue={editCurrency.code} type="text"/>
                            </AddingInputs>
                        </AddingRow>
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Limit</AddingNames>
                                <AddingInput onChange={(e) => handleLimit(e.target.value)} defaultValue={editCurrency.limit} type="text"/>
                            </AddingInputs>
                        </AddingRow>
                        <AddingRow>
                            <AddingInputs>
                                <AddingNames>Chips</AddingNames>
                                {
                                    editChips?.map((value, key) => {
                                        return <AddingInput key={key} onChange={(e) => handleChips(key, e.target.value)}
                                                            type="number" placeholder={`Chip ${++key}`} defaultValue={value}/>
                                    })
                                }
                            </AddingInputs>
                        </AddingRow>
                        <AddingCenteredRow>

                            <ButtonDiv>
                                <AddingButton onClick={()=>handleEditCurrency(editCurrency.id)}>Edit Currency</AddingButton>
                            </ButtonDiv>
                        </AddingCenteredRow>
                    </AddCurrency>
                </EditCurrency>
                }
            </TabContent>
        </>
    );
};

export default CurrencyAdd;

const UserText = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  color: white;
  font-size: 16px;
  left: 15px;
`
const Message = styled.span`
  color: green;
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

const AddingCurrency = styled.div`
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
const EditCurrency = styled.div`
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

const AddingCenteredRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 20px;
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
const AddCurrency = styled.div`
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
const ErrorMessage = styled.span`
  color: red;
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
  @media screen and (max-width: 440px) {
    font-size: 14px;
    padding-left: 16px;
  }
`;
