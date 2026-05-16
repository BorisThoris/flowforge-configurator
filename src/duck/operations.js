// operations.js
import { Creators } from "./actions";

const requestInitialDataAction = Creators.requestInitialData;
const receiveInitialDataAction = Creators.receiveInitialData;

const startProjectUpdate = Creators.startProjectUpdate;

const MOCK_CHANNELS = [
  { id: "email", name: "Email Campaign" },
  { id: "crm", name: "CRM Sync" },
  { id: "support", name: "Support Intake" },
  { id: "analytics", name: "Analytics Export" },
];

const fetchInitialData = () => {
  return (dispatch) => {
    dispatch(requestInitialDataAction());

    return Promise.resolve(MOCK_CHANNELS).then((channels) => {
      dispatch(receiveInitialDataAction(channels));
    });
  };
};

//  Where my update logic would go
const updateProject = (passedState) => {
  return (dispatch) => {
    dispatch(startProjectUpdate());
    return Promise.resolve(passedState).then((responseData) => {
      dispatch(receiveInitialDataAction(responseData));
    });
  };
};

export default {
  fetchInitialData,
  updateProject,
};
