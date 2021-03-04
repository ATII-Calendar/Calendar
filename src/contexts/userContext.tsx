import React, { createContext, useContext, useReducer } from 'react';
import { initialState } from '../reducer'

interface IContextProps {
  state: any,
  dispatch: any;
}
export const UserContext = createContext({} as IContextProps);

export const UserProvider = ({ reducer, children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => useContext(UserContext);
