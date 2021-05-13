import firebase from 'firebase';

export const initialState: {
  user: firebase.User | null,
  userSettings: any,
  userIsAdmin: boolean
} = {
  user: null,
  userSettings: null,
  userIsAdmin: false,
}

export enum actionTypes {
  SET_USER,
  SET_USER_SETTINGS,
  SET_USER_IS_ADMIN,
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

    case actionTypes.SET_USER_IS_ADMIN:
      return {
        ...state,
        userIsAdmin: action.userIsAdmin
      }

    default:
      return state
  }
}

export default reducer
