import React, { createContext, useContext, useReducer } from 'react';
import { initialState } from '../reducer'

export const UserContext = createContext(initialState);

export const UserProvider = ({ reducer, children }: any) => (
  <UserContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </UserContext.Provider>
)

export const useUserValue = () => useContext(UserContext);
