import React from 'react';
import styled from "styled-components";

const NotFound = () => {
    return (<Body>
        <h1>Don't have permissions</h1>
        </Body>);
};

const Body = styled.div`
 display: flex;
  justify-content: center;
  color: white;
  width: 100%;
  align-items: center;
`;

export default NotFound;