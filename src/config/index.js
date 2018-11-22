
const argv = {
	projectId: process.env.PROJECT_ID,
	cloudRegion: process.env.CLOUD_REGION,
	registryId: process.env.REGISTRY_ID,
	deviceId: process.env.DEVICE_ID,
	robotDeviceId: process.env.ROBOT_DEVICE_ID,
	privateKeyFile: process.env.PRIVATE_KEY_FILE,
	algorithm: process.env.ALGORITHM,
	tokenExpMins: process.env.TOKEN_EXP_MINS,
	mqttBridgeHostname: process.env.MQTT_BRIDGE_HOST_NAME,
	mqttBridgePort: process.env.MQTT_BRIDGE_PORT,
    messageType: process.env.MESSAGE_TYPE,
};

export default argv