import firebase from 'firebase';

export const initialState: { user: firebase.User | null, classes: any[] | null } = {
  user: null,
  classes: null
}

export enum actionTypes {
  SET_USER,
  SET_CLASSES
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      }

    case actionTypes.SET_CLASSES:
      return {
        ...state,
        classes: action.classes
      }

    default:
      return state
  }
}

export default reducer
