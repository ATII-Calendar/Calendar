import firebase from 'firebase';

export const initialState: {
  user: firebase.User | null,
  userSettings: any
} = {
  user: null,
  userSettings: null
}

export enum actionTypes {
  SET_USER,
  SET_USER_SETTINGS
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      }

    case actionTypes.SET_USER_SETTINGS:
      return {
        ...state,
        userSettings: action.userSettings
      }

    default:
      return state
  }
}

export default reducer
