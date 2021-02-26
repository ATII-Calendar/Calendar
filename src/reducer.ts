import firebase from 'firebase';

export const initialState: { user: firebase.User | null } = {
  user: null
}

export enum actionTypes {
  SET_USER,
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}

export default reducer
