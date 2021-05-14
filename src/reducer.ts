import firebase from 'firebase';

export const initialState: {
  user: firebase.User | null,
  userSettings: any,
  userIsAdmin: boolean,
  globalEvents: any[]
} = {
  user: null,
  userSettings: null,
  userIsAdmin: false,
  globalEvents: []
}

export enum actionTypes {
  SET_USER,
  SET_USER_SETTINGS,
  SET_USER_IS_ADMIN,
  SET_GLOBAL_EVENTS,
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

    case actionTypes.SET_GLOBAL_EVENTS:
      return {
        ...state,
        globalEvents: action.globalEvents
      }

    default:
      return state
  }
}

export default reducer
