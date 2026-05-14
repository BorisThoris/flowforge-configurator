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
    /*eslint-disable */
    //suppress all warnings between comments
    return fetch(`http://localhost:5000/db`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(passedState),
    })
      .then((response) => response.json())
      .then((json) => {
        const responseData = json;
        dispatch(receiveInitialDataAction(responseData));
      });
    /*eslint-enable */
  };
};

export default {
  fetchInitialData,
  updateProject,
};
