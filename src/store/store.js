import Vue from 'vue'

const state = Vue.observable({ data: {}, resources: {} });

export default () => state

export const addResource = (resource) => {
    Vue.set(state.resources, resource.name, resource);
};

export const addResourceResponse = (response) => {
    var dataAction = state.resources[response.resourceName]?.dataActions[response.dataActionName];
    if (!dataAction) {
        //if it isn't a dataAction then most likely a server call inside a client action
        Vue.set(
            state.resources[response.resourceName].serverActions,
            response.dataActionName,
            { requestData: response.requestData }
        );
        return;
    }
    Vue.set(dataAction, "requestData", response.requestData);
    var requestCount = dataAction.requestsCount
        ? dataAction.requestsCount + 1
        : 1;
    dataAction.requestsCount = requestCount;
    Vue.set(dataAction.requestData, "requestsCount", requestCount);
};

export const addLocalStorage = (localStorage) => {
    Vue.set(state.data, "localStorage", localStorage);
}