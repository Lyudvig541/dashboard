import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { changeDefaultCurrency, index } from "../../actions/currency";

const Currency = () => {
    const [currencies, setCurrencies] = useState([]);
    const [defaultCurrency, setDefaultCurrency] = useState();

    const changeDefault = (event) => {
        setDefaultCurrency(event.target.value);
        changeDefaultCurrency(event.target.value);
    }
    useEffect(()=>{
        index().then((data) => {
            data.map(item => item.is_default && setDefaultCurrency(item));
            setCurrencies(data);
        })
    },[]);
    return (<>
        <TabContent>
            <Row>
                <div>Currency  <small>(Select default currency for all project)</small></div>
                <ButtonDiv>
                    <Select name="currency" onChange={changeDefault} value={defaultCurrency?.id}>
                        {currencies.map((item)=><Option value={item.id} key={item.id} >{item.name} - {item.code}</Option>)}
                    </Select>
                </ButtonDiv>
            </Row>
            <Line/>
        </TabContent>
        </>);
};

export default Currency;

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
  font-size: 18px;
  color: #A3AED0;
  display: flex;
  justify-content: space-between;
  width: 95%;
  height: 100px;
  align-items: center;
  @media screen and (max-width: 700px) {
    flex-direction: column;

  }`;
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