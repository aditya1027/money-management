import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
//import thunk from 'redux-thunk';
//Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';
//@todo

const firebaseConfig = {


    apiKey: "AIzaSyCA_SpuathUVBQiOEZxh-sUTFPwTewWsrI",
    authDomain: "reactclientpanel-a0f1c.firebaseapp.com",
    databaseURL: "https://reactclientpanel-a0f1c.firebaseio.com",
    projectId: "reactclientpanel-a0f1c",
    storageBucket: "reactclientpanel-a0f1c.appspot.com",
    messagingSenderId: "669350663773",
    appId: "1:669350663773:web:d9bf10599091b5f82ddfb4",
    measurementId: "G-07GE1TBGT4"

};


// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

//Initial firebase instance
firebase.initializeApp(firebaseConfig);

//Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

//Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);


const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    notify: notifyReducer,
    settings: settingsReducer
});

//Check for settings in localStorage
if (localStorage.getItem('settings') == null) {
    //Default settings
    const defaultSettings = {
        disableBalanceOnAdd: true,
        disableBalanceOnEdit: false,
        allowRegistration: false
    }

    //Set to local storage
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

//Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) };



// Create store
const store = createStoreWithFirebase(
    rootReducer,
    initialState,
    compose(
        // applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
        reactReduxFirebase(firebase),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ));

export default store;
