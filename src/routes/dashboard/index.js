import styled from "styled-components";
import React, {useEffect, useState} from "react";
import Chart from "./chart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    getProductSales,
    getDailyProfit,
    getTotalValues,
    getNumberOfBets,
    getNumberOfPlayers,

} from "../../actions/transaction";
import bitIcon from "../../assets/images/refresh.png";

export default function Dashboard() {

    const [data, setData] = useState([]);
    const [totalValues, setTotalValues] = useState({
        amount: 0,
        win: 0,
        profit: 0,
        bets: 0,
        players: 0,
        percentage: 0,
        winRate: 0,
    });
    const [startDate, setStartDate] = useState(new Date() - 604800000);
    const [endDate, setEndDate] = useState(+(new Date()) + 7000000);
    useEffect(() => {
        getTotalValues(startDate, +endDate).then(data => data && setTotalValues(data));
    }, [startDate, endDate]);
    useEffect(() => {
        getProductSales(startDate, endDate).then(sales => setData(sales));
    }, [startDate, endDate]);

    // let totalBetAmount = 0;
    function totalBetAmountEachCurrency(data) {
        let sum = 0;
        data.forEach((value) => sum += value.betAmount);
        return sum / 100;
    }

    function gameProfit(data) {
        let sum = 0;
        data.forEach((value) => value.currentStatus === "WIN_SENT" && (sum += value.winAmount));
        return (totalBetAmountEachCurrency(data) - sum / 100).toFixed(2);
    }

    const betsCount = (data) => {
        let sum = 0;
        data.forEach((value) => sum += value.Bets.length);
        return sum;
    }
    const refreshProductSales = () => {
        getProductSales(startDate, endDate).then(sales => setData(sales));
    }
    return (<Container>
        <DashBoardHeader>
            <DashBoardHeaderTitle>
                <WelcomeTittle>Welcome to BTCRoulette!</WelcomeTittle>
            </DashBoardHeaderTitle>
            <DateRage>
                <Search>
                    <DatePicker dateFormat="dd/MM/yyyy" selected={startDate}
                                onChange={(date) => setStartDate(date)}/>
                </Search>
                <Search>
                    <DatePicker dateFormat="dd/MM/yyyy" selected={endDate} onChange={(date) => setEndDate(date)}/>
                </Search>
            </DateRage>

        </DashBoardHeader>
        <Timezone>
            <TimezoneText>TIMEZONE IS GMT 00</TimezoneText>
        </Timezone>
        <DashboardTable>
            <DashboardTableText>
                <span>Dashboard</span>
                <div onClick={refreshProductSales}>
                    <img src={bitIcon} width={25} height={25} alt="icon" className='bitIcon'/>
                </div>
            </DashboardTableText>
            <Scroll>
                <TableHeader>
                    <HeaderContent>Currency</HeaderContent>
                    <HeaderContent>Betting Amount</HeaderContent>
                    <HeaderContent>Players Win</HeaderContent>
                    <HeaderContent>Game Profit</HeaderContent>
                    <HeaderContent>Number of Bets<br/>(Total)</HeaderContent>
                    <HeaderContent>Number of Bets<br/>(Per Player)</HeaderContent>
                    <HeaderContent>Payout Percentage<br/>(%)</HeaderContent>
                </TableHeader>
                <TableBody>
                    {data && data.length ? data.map((item, key) => {
                        return (<Rows key={key} id={key}>
                            <RowContent>{item.code}</RowContent>
                            <RowContent>{(totalBetAmountEachCurrency(item.Transactions)).toFixed(2)}</RowContent>
                            <RowContent>{(totalBetAmountEachCurrency(item.Transactions) - gameProfit(item.Transactions)).toFixed(2)}</RowContent>
                            <RowContent>{gameProfit(item.Transactions)}</RowContent>
                            <RowContent>{betsCount(item.Transactions)}</RowContent>
                            <RowContent>{(betsCount(item.Transactions) / item.Transactions.length).toFixed(0)}</RowContent>
                            <RowContent>{((gameProfit(item.Transactions) / totalBetAmountEachCurrency(item.Transactions)) * 100).toFixed(2) } %</RowContent>
                        </Rows>)
                    }) : null}
                </TableBody>
                <TableFooter>
                    <FooterContent>Total ({totalValues.default})</FooterContent>
                    <FooterContent>{totalValues.data?.amount}</FooterContent>
                    <FooterContent>{(totalValues.data?.amount - totalValues.data?.profit).toFixed(2)}</FooterContent>
                    <FooterContent>{totalValues.data?.profit}</FooterContent>
                    <FooterContent>{totalValues.data?.bets}</FooterContent>
                    <FooterContent>{totalValues.data?.players}</FooterContent>
                    <FooterContent>{totalValues.data?.percentage} %</FooterContent>
                </TableFooter>
            </Scroll>
        </DashboardTable>
        <DashboardChart>
            <ChartTables>
                <ChartHeader>Daily Profit</ChartHeader>
                <Chart chartColor={"#5694f9"} action={getDailyProfit} startDate={startDate} endDate={endDate}/>
            </ChartTables>
            <ChartTables>
                <ChartHeader>Number of Bets</ChartHeader>
                <Chart chartColor={"#7cc35d"} action={getNumberOfBets} startDate={startDate} endDate={endDate}/>
            </ChartTables>
            <ChartTables>
                <ChartHeader>Number of Players</ChartHeader>
                <Chart chartColor={"#7cc35d"} action={getNumberOfPlayers} startDate={startDate} endDate={endDate}/>
            </ChartTables>
        </DashboardChart>
    </Container>);

}
const DateRage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 350px;
`;
const Search = styled.div`
  display: flex;
  width: 162px;
  background: rgba(29, 34, 55, 0.8);
  border: 1px solid rgba(163, 174, 208, 0.2);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 12px 0 15px 20px;

  > .react-datepicker-wrapper {
    width: 105px;
    margin-left: 10px;

    > .react-datepicker__input-container {
      width: 105px;

      > input {
        width: 105px;
        background: rgba(29, 34, 55, 0.8);
        color: white;
        border: none;
      }
    }
  }
`;
const DashBoardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 1100px) {
    flex-direction: column;
  }
`;
const DashBoardHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;

`;
const WelcomeTittle = styled.div`
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 42px;
  color: #FFFFFF
`;
const Scroll = styled.div`
  @media screen and (max-width: 900px) {
    overflow-x: scroll !important;
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  padding: 20px 60px 0 60px;
  height: 100%;
  width: 100%;
  min-height: 100% !important;
  background-color: #181C2D;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 4px;
    height: 30px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(221 223 229 / 10%);
    border-radius: 5px;
  }

  @media screen and (max-width: 1440px) {
    padding: 20px 50px 0 15px;
    margin: auto;
  }
  @media screen and (max-width: 768px) {
    overflow-x: scroll !important;
  }
`;

const DashboardTable = styled.div`
  margin-top: 10px;
  padding: 24px;
  background: #131620;
  border-radius: 12px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: 700;
  font-size: 13.33px;
  line-height: 20px;
  letter-spacing: 0.4px;
  @media screen and (max-width: 1300px) {
    font-size: 12px;
  }
  @media screen and (max-width: 900px) {
    width: auto;
    padding: 24px 15px;

  }
`;

const DashboardTableText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #FFFFFF;

  & > div {
    display: flex;
    cursor: pointer;
  }
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  width: 100%;
  height: 65px;
  border-radius: 12px;
  background: #181C2D;
  @media screen and (max-width: 900px) {
    width: 700px;
  }
`;
const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 900px) {
    width: 700px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  color: white;
  text-align: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  font-family: Nexa Bold, serif;
  align-items: center;
`;

const Rows = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: row;
  color: white;
  text-align: center;
  width: 100%;
  height: 60px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 13.33px;
  letter-spacing: 0.4px;
  border-bottom: 1px solid rgba(221, 223, 229, 0.1);
`;

const RowContent = styled.div`
  display: flex;
  color: white;
  text-align: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TableFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
  width: 100%;
  height: 65px;
  background: #181C2D;
  border-radius: 12px;
  @media screen and (max-width: 900px) {
    width: 700px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  color: white;
  text-align: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 13.33px;
  letter-spacing: 0.4px;
  align-items: center;
`;

const DashboardChart = styled.div`
  display: flex;
  gap: 22px;
  width: 100%;
  height: 382px;
  margin-top: 32px;
  margin-bottom: 32px;
  border-radius: 12px;
  min-height: 382px !important;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: 1300px) {
    flex-direction: column;
    width: 95%;
  }
`;

const ChartTables = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  background: #131620;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 15px 0 0 10px;
  @media screen and (max-width: 1300px) {
    width: 100%;
    margin-bottom: 30px;
  }
`;

const Timezone = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const TimezoneText = styled.div`
  width: 260px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  letter-spacing: 0.4px;
  color: #ffffff;
  margin-top: 10px;
`;
const ChartHeader = styled.div`
  font-family: Nexa Bold, serif;
  font-style: normal;
  color: #A3AED0;
  font-weight: bold;
  font-size: 16px;
  padding: 4px 0 36px 25px;
`