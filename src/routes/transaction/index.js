import styled from "styled-components";
import search from '../../assets/images/search.svg';
import downloadSvg from '../../assets/images/download.svg';
import right from '../../assets/images/right.svg';
import left from '../../assets/images/left.svg';
import React, {useEffect, useState} from "react";
import {getTransactions, download, timezoneToMSec} from "../../actions/transaction";
import DatePicker from "react-datepicker";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [openBefore, setOpenBefore] = useState(0);
    const [searchField, setSearchField] = useState('roundId');
    const [searchValue, setSearchValue] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [open, setOpen] = useState(false);
    const timezone = localStorage.getItem('timezone')
    const [currentPage, setCurrentPage] = useState(1);
    const [dataCount, setDataCount] = useState(100);
    useEffect(() => {
        getTransactions(searchField, searchValue,currentPage,dataCount ,startDate, endDate).then(data => {
            setTransactions(data.data);
            setTotalCount(data.totalCount);
        });
    }, [currentPage]);

    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    }
    const formatDate = (date) => {
        let ms = new Date(+date + timezoneToMSec())
        return [
            padTo2Digits(ms.getDate()),
            padTo2Digits(ms.getMonth() + 1),
            ms.getFullYear(),
        ].join(' ');
    }
    const formatTime = (date) => {
        let ms = new Date(+date + timezoneToMSec())
        return ms.toLocaleTimeString('en-GB');
    }
    const previousData = () => {
        return currentPage !== 1 ? setCurrentPage(currentPage - 1) : 1;
    };
    const nextData = () => {
        return currentPage !== Math.ceil(totalCount / dataCount) ? setCurrentPage(currentPage + 1) : currentPage;
    };
    const openBets = (id) => {
        setOpenBefore(id)
        if (openBefore === id) {
            setOpen(false)
            setOpenBefore(0)
        } else {
            setOpen(true)
        }
    }
    const changeSearchSelect = (e) => {
        setSearchField(e.target.value);
    }
    const changeSearchInput = (e) => {
        setSearchValue(e.target.value);
    }
    const getTransactionsViaSearchData = () => {
        if ((searchValue || startDate) && searchField) {
            let date;
            if (searchField === "date") {
                date = startDate + '&' + endDate;
            }
            getTransactions(searchField, date || searchValue, currentPage, dataCount, startDate, endDate).then(data => {
                setTransactions(data.data);
                setTotalCount(data.totalCount);
            });
        }
    }
    return (<Container>
        <Header>
            <SearchPart>
                <Search>
                    <img src={search} alt="title" width={15} height={11}/>
                    <Input type="text" placeholder={"Search"} defaultValue={searchValue}
                        onChange={changeSearchInput}/>
                </Search>
                <SelectSearch onChange={changeSearchSelect}>
                    <option value='roundId'>Round</option>
                    <option value='txID'>TxID</option>
                    <option value='currency'>Currency</option>
                    <option value='userID'>User ID</option>
                    <option value='betAmount'>Bet Amount</option>
                    <option value='winAmount'>Win Amount</option>
                    <option value='status'>Status</option>
                </SelectSearch>
                <DateRage>
                    <SearchColendar>
                        <DatePicker dateFormat="dd/MM/yyyy" selected={startDate}
                                    onChange={(date) => setStartDate(+date + (+timezone)*3600000 )} placeholder/>
                    </SearchColendar>
                    <SearchColendar>
                        <DatePicker dateFormat="dd/MM/yyyy" selected={endDate}
                                    onChange={(date) => setEndDate(+date + (+timezone)*3600000)}/>
                    </SearchColendar>
                </DateRage>
                <Button onClick={getTransactionsViaSearchData}>
                    <img src={search} alt="title" width={15} height={11}/>
                    Search
                </Button>
            </SearchPart>
            <DownloadButton onClick={() => {download()}} download>
                <DownloadButtonTitle>Download Excel</DownloadButtonTitle>
                <img src={downloadSvg} alt="title" width={17} height={17}/>
            </DownloadButton>
        </Header>

        <DashBoardTable>
            <DashBoardHeader>Transactions</DashBoardHeader>
            <Scroll>
                <TableHeader>
                    <HeaderContent>Round</HeaderContent>
                    <HeaderContent>Date</HeaderContent>
                    <HeaderContent>
                        <div>Time</div>
                        <div> {`GMT ${timezone > 0 ? `+(${timezone})` : `(${timezone})`}`}</div>
                    </HeaderContent>
                    <HeaderContent width={"180%"}>TxID</HeaderContent>
                    <HeaderContent>Currency</HeaderContent>
                    <HeaderContent>User ID</HeaderContent>
                    <HeaderContent>Bet</HeaderContent>
                    <HeaderContent>Win</HeaderContent>
                </TableHeader>
                <TableBody>
                    {transactions && transactions.length ? transactions.map((item, key) => {
                            return (<div key={key}>
                                <Rows key={key} id={key} onClick={() => openBets(item.id)}>
                                    <RowContent>{item.Round?.roundNumber}</RowContent>
                                    <RowContent opacity={1}>{formatDate(new Date(item.createdAt))}</RowContent>
                                    <RowContent opacity={1}>{formatTime(new Date(item.createdAt))}</RowContent>
                                    <RowContent opacity={1} width={"180%"}>{item.transactionId}</RowContent>
                                    <RowContent opacity={1}>{item.Currency.code}</RowContent>
                                    <RowContent>{item.UserId}</RowContent>
                                    <RowContent>{item.betAmount}</RowContent>
                                    <RowContent>{item.winAmount}</RowContent>
                                </Rows>

                                {item.Bets.length ? <Bets key={item.id} active={open && openBefore === item.id}>
                                    <TableHeader>
                                        <HeaderContent>Bet Type</HeaderContent>
                                        <HeaderContent>Odd</HeaderContent>
                                        <HeaderContent>Value</HeaderContent>
                                        <HeaderContent>BetAmount</HeaderContent>
                                        <HeaderContent>PossibleWinAmount</HeaderContent>
                                        <HeaderContent>Status</HeaderContent>
                                    </TableHeader>
                                    {item.Bets.map((bet) => {
                                        return <Rows key={bet.id}>
                                            <RowContent>{bet.betType}</RowContent>
                                            <RowContent>{bet.odd}</RowContent>
                                            <RowContent>{bet.value}</RowContent>
                                            <RowContent>{bet.betAmount}</RowContent>
                                            <RowContent>{bet.possibleWinAmount}</RowContent>
                                            <RowContent>{bet.status}</RowContent>
                                        </Rows>
                                    })}
                                </Bets> : null}
                            </div>)
                        })
                        : null}
                </TableBody>
            </Scroll>
            <Pagination>
                Rows per page :
                <Select onChange={(e) => setDataCount(e.target.value)}>
                    <option value={50}>50</option>
                    <option value={100} selected={true}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                    <option value={250}>250</option>
                    <option value={300}>300</option>
                    <option value={350}>350</option>
                    <option value={400}>400</option>
                    <option value={450}>450</option>
                    <option value={500}>500</option>
                    <option value={550}>550</option>
                    <option value={600}>600</option>
                    <option value={650}>650</option>
                    <option value={700}>700</option>
                    <option value={750}>750</option>
                    <option value={800}>800</option>
                    <option value={850}>850</option>
                    <option value={900}>900</option>
                    <option value={950}>950</option>
                    <option value={1000}>1000</option>
                </Select>
                {(currentPage - 1) * dataCount + 1} -
                {(totalCount > currentPage * dataCount) ? currentPage * dataCount : totalCount}&nbsp;&nbsp;
                of &nbsp;&nbsp; {totalCount}
                <NextPrev>
                    <ClickImage onClick={previousData}>
                        <img src={left} alt="left" width={12} height={10}/>
                    </ClickImage>
                    <ClickImage onClick={nextData}>
                        <img src={right} alt="right" width={12} height={10}/>
                    </ClickImage>
                </NextPrev>
            </Pagination>
        </DashBoardTable>
    </Container>)
        ;

}
const Container = styled.div`
  padding: 36px 50px 0 30px;
  width: 100%;
  min-height: 100%;
  @media (max-width: 1660px) {
    padding: 36px 50px 0 30px;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: normal;
  }
`;
const Search = styled.div`
  display: flex;
  width: 329px;
  background: rgba(29, 34, 55, 0.8);
  border: 1px solid rgba(163, 174, 208, 0.2);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 12px 0 15px 20px;
  align-items: center;
`;
const SearchPart = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;
const Input = styled.input`
  width: 100%;
  margin: auto 15px auto 10px;
  background: none;
  border: none;
  font-family: "Nexa Bold", serif;
  font-weight: 300;
  font-size: 14px;
  color: #A3AED0;

  ::placeholder {
    color: #A3AED0;
  }

  :focus {
    outline: none !important;
    border: none;
    color: #A3AED0;
    font-weight: 200;
  }
`;
const DownloadButton = styled.div`
  display: flex;
  justify-content: center;
  width: 185px;
  height: 42px;
  background: #558EFE;
  border-radius: 8px;
  cursor: pointer;
  align-items: center;
  @media (max-width: 700px) {
    margin-top: 10px;
  }
`;
const DownloadButtonTitle = styled.a`
  display: flex;
  color: #ffffff;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  margin-right: 10px;
`;
const DashBoardTable = styled.div`
  margin-top: 15px;
  padding: 32px;
  background: #131620;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 700px) {
    margin-right: 20%;
  }

`;
const DashBoardHeader = styled.div`
  width: 236px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.4px;
  color: #FFFFFF;
  margin-bottom: 15px;
`;
const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 65px;
  background: #181C2D;
  border-radius: 12px;
  @media (max-width: 700px) {
    width: 1300px
  }
`;
const TableBody = styled.div`
  height: 600px;
  overflow-y: scroll;

  ::-moz-range-thumb {
    width: 2px;
    scrollbar-width: 2px;
    height: 60px;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(221 223 229 / 10%);
    border-radius: 5px;
  }

  @media (max-width: 1700px) {
    height: 400px;
  }
  @media (max-width: 700px) {
    width: 1300px;
  }
`;
const Scroll = styled.div`
  overflow-x: auto;

  ::-moz-range-thumb {
    width: 2px;
    scrollbar-width: 2px;
    height: 60px;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(221 223 229 / 10%);
    border-radius: 5px;
  }

  @media (max-width: 1700px) {
    overflow-x: scroll;
    overflow-y: hidden;
  }
`;
const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  font-style: normal;
  font-weight: bold;
  letter-spacing: 0.4px;
  font-size: 12px;
  width: ${({width}) => width ? width : '100%'};
  height: 100%;
  justify-content: center;
  font-family: Nexa Bold, serif;
  align-items: center;
`;
const Rows = styled.div`
  margin-top: 2px;
  display: flex;
  color: white;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid rgba(221, 223, 229, 0.1);
  flex-direction: row;
`;
const RowContent = styled.div`
  display: flex;
  color: #ffffff;
  text-align: center;
  width: ${({width}) => width ? width : '100%'};
  justify-content: center;
  align-items: center;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.4px;
  opacity: ${({opacity}) => opacity ? '0.6' : ""};
`;
const Pagination = styled.div`
  display: flex;
  justify-content: end;
  padding: 20px 20px 0 0;
  color: #A3AED0;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 18px;
  @media screen and (max-width: 768px) {
    justify-content: start;
  }
  @media screen and (max-width: 586px) {
    flex-direction: column;
  }
`;
const Select = styled.select`
  padding: 0;
  margin: 0 15px 0 10px;
  height: 23px !important;
  color: #A3AED0;
  background: inherit;
  border: none;

  &:active {
    border: none;
  }

  &:focus {
    border: none;
  }

  > option {
    background: #131620;
    border: none;
  }

  @media screen and (max-width: 586px) {
    width: 50px;
    margin: 5px 15px 5px 10px;

  }
`;
const NextPrev = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  width: 50px;
`;
const ClickImage = styled.div`
  cursor: pointer;
`;


const Bets = styled.div`
  display: ${({active}) => active ? 'flex' : 'none'};
  flex-direction: column;
  color: white;
  text-align: center;
  width: 100%;
  height: 100%;
  min-height: 60px;
  font-family: Nexa Bold, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 13.33px;
  letter-spacing: 0.4px;
  border-bottom: 1px solid rgba(221, 223, 229, 0.1);
  background: #262d43;
  border-radius: 16px;
`;
const SelectSearch = styled.select`
  width: auto;
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
const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 42px;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  font-family: "Nexa Bold", serif;
  font-style: normal;
  font-weight: 300;
  border: 1px solid #558EFE;
  background: #558EFE;
  border-radius: 8px;

  &:active {
    background-color: #175ee9;
  }
`;
const DateRage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 350px;
`;
const SearchColendar = styled.div`
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