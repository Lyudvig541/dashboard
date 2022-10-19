import styled from "styled-components";
import React, {useEffect} from "react";
import {useState} from "react";
import {getPendingBets, getCompletedBet} from "../../actions/transaction";
import dropDown from '../../assets/images/dropDown.svg';

export default function Monitoring() {

    const [before, setBefore] = useState([]);
    const [during, setDuring] = useState([]);
    useEffect(() => {
        getPendingBets().then(data => setBefore(data))
        setInterval(() => {
            getPendingBets().then(data => setBefore(data));
        }, 5000)
    }, []);

    useEffect(() => {
        getCompletedBet().then(data => setDuring(data))
        setInterval(() => {
            getCompletedBet().then(data => setDuring(data));
        }, 5000)
    }, []);

    const [openBefore, setOpenBefore] = useState(null);
    const [openDuring, setOpenDuring] = useState(null);

    const totalBet = (bets) => {
        let sum = 0;
        for (let i = 0; i < bets.length; i++) {
            sum += bets[i].betAmount;
        }
        return sum;
    }
    return (<Main>
        <Table>
            <TableText>
                <TableText1>Bettor List</TableText1>
                <TableText2>Before round start</TableText2>
            </TableText>
            <TableHeader>
                <HeaderContent>Username</HeaderContent>
                <HeaderContent>Betting Amount</HeaderContent>
                <HeaderContent/>
            </TableHeader>
            <Rows>
                {before && before.length ? before.map((item, key) => {
                    return (<RowItem key={key}>
                        <Row onClick={() => {
                            setOpenBefore(openBefore === item.username ? null : item.username)
                        }} openBefore={item.username === openBefore}>
                            <RowContent>{item.username}</RowContent>
                            <RowContent>{totalBet(item.Bets)}</RowContent>
                            <RowContent>
                                <RotateIcon openSettings={openBefore === item.username}>
                                    <img src={dropDown} alt="icon"/>
                                </RotateIcon>
                            </RowContent>
                        </Row>
                        <RowBody active={openBefore === item.username}>
                            {item.Bets.map((bet) => {
                                return <Bets key={bet.id}>
                                    <RowContent>
                                        <div>{bet.betType}</div>
                                        <div>{bet.value}</div>
                                    </RowContent>
                                    <RowContent>{bet.Currency.code}</RowContent>
                                    <RowContent>{bet.betAmount}</RowContent>
                                </Bets>
                            })}
                        </RowBody>
                    </RowItem>)
                }) : null}
            </Rows>
        </Table>
        <Table>
            <TableText>
                <TableText1>Bettor List</TableText1>
                <TableText2>During the round</TableText2>
            </TableText>
            <TableHeader>
                <HeaderContent>Username</HeaderContent>
                <HeaderContent>Betting Amount</HeaderContent>
                <HeaderContent/>
            </TableHeader>
            <Rows>
                {during && during.length ? during.map((item, key) => {
                    return (<RowItem key={key}>
                        <Row>
                            <RowContent>{item.username}</RowContent>
                            <RowContent>{totalBet(item.Bets)}</RowContent>
                            <RowContent>
                                <RotateIcon key={key} onClick={() => {
                                    setOpenDuring(openDuring === item.username ? null : item.username)
                                }} openSettings={openDuring === item.username}>
                                    <img src={dropDown} alt="icon"/>
                                </RotateIcon>
                            </RowContent>
                        </Row>
                        <RowBody active={openDuring === item.username}>
                            {item.Bets.map((item) => {
                                return <Bets key={item.id}>
                                    <RowContent>
                                        <div>{item.betType}</div>
                                        <div>{item.value}</div>
                                    </RowContent>
                                    <RowContent>{item.Currency.code}</RowContent>
                                    <RowContent>{item.betAmount}</RowContent>
                                </Bets>
                            })}
                        </RowBody>
                    </RowItem>)
                }) : null}
            </Rows>
        </Table>
    </Main>)
}

const RotateIcon = styled.div`
  img {
    ${({openSettings}) => openSettings ? 'transform: rotate(180deg)' : 'transform: rotate(0deg)'};
  }

  cursor: pointer;
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  background: #181d2c;
  padding-bottom: 25px;
  height: 100%;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: unset;
    align-items: center;
    overflow-y: scroll;
    padding-bottom: 25px;
  }
`;

const Table = styled.div`
  margin-top: 25px;
  padding: 32px;
  display: flex;
  background: #131620;
  border-radius: 12px;
  flex-direction: column;
  height: 90%;
  width: 40%;
  @media screen and (max-width: 1000px) {
    width: 65%;
  }
`;
const TableText = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
`;
const TableText1 = styled.div`
  display: flex;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
`;
const TableText2 = styled.div`
  display: flex;
  font-weight: 300;
  font-size: 14px;
  color: #A3AED0;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  height: 70px;
  background: #181C2D;
  border-radius: 12px;
`;
const Rows = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1px;
  width: 100%;
  height: 100%;
  flex-direction: column;
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

const RowItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  color: white;
  text-align: center;
  width: 100%;
  height: 60px;
  min-height: 60px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 13.33px;
  letter-spacing: 0.4px;
  border-bottom: 1px solid rgba(221, 223, 229, 0.1);
  cursor: pointer;

`;
const RowBody = styled.div`
  display: ${({active}) => active ? 'flex' : 'none'};
  flex-direction: column;
`;
const Bets = styled.div`
  display: flex;
  color: white;
  text-align: center;
  width: 100%;
  height: 60px;
  min-height: 60px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 13.33px;
  letter-spacing: 0.4px;
  border-bottom: 1px solid rgba(221, 223, 229, 0.1);
  background: #262d43;
`;

const RowContent = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;

`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  letter-spacing: 0.4px;
  font-size: 14px;
  text-align: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;