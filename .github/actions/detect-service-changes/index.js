const core = require('@actions/core');

// service prefixes
const apiRecommendationPrefix = "api/recommendation";
const apiEventdbPrefix= "api/eventdb";
const shopPrefix = "shop";

// service names
const apiRecommendation = "api-recommendation";
const apiEventdb = "api-eventdb";
const shop = "shop";

function getPrefixMap() {
    const servicePrefixToOutputMap = new Map();
    servicePrefixToOutputMap.set(apiRecommendationPrefix, apiRecommendation);
    servicePrefixToOutputMap.set(apiEventdbPrefix, apiEventdb);
    servicePrefixToOutputMap.set(shopPrefix, shop);
    return servicePrefixToOutputMap;
}

try {
    const prefixMap = getPrefixMap();
    const changedFiles = JSON.parse(core.getInput('changed-files'));
    const changedServicesMap = changedFiles.reduce((acc, file) => {
        prefixMap.forEach((serviceName, servicePrefix) => {
            if (file.startsWith(servicePrefix)) {
                console.log(`found changes for service ${serviceName}, updating output`);
                acc[serviceName] = true;
            }
        });
        return acc;
    }, {});
    core.setOutput("services", Object.keys(changedServicesMap));
} catch (error) {
    core.setFailed(error.message);
}