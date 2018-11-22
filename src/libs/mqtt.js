import jwt from 'jsonwebtoken';
import mqtt from 'async-mqtt';
import argv from '../config';

const fs = require('fs');

// const argv = {
// 	projectId: process.env.PROJECT_ID,
// 	cloudRegion: process.env.CLOUD_REGION,
// 	registryId: process.env.REGISTRY_ID,
// 	deviceId: process.env.DEVICE_ID,
// 	privateKeyFile: process.env.PRIVATE_KEY_FILE,
// 	algorithm: process.env.ALGORITHM,
// 	tokenExpMins: process.env.TOKEN_EXP_MINS,
// 	mqttBridgeHostname: process.env.MQTT_BRIDGE_HOST_NAME,
// 	mqttBridgePort: process.env.MQTT_BRIDGE_PORT,
// 	messageType: process.env.MESSAGE_TYPE,
// };
// Create a Cloud IoT Core JWT for the given project id, signed with the given
// private key.
// [START iot_mqtt_jwt]
function createJwt(projectId, privateKeyFile, algorithm) {
	// Create a JWT to authenticate this device. The device will be disconnected
	// after the token expires, and will have to reconnect with a new token. The
	// audience field should always be set to the GCP project id.
	const token = {
		iat: parseInt(Date.now() / 1000),
		exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
		aud: projectId,
	};
	const privateKey = fs.readFileSync(privateKeyFile);
	return jwt.sign(token, privateKey, { algorithm: algorithm });
}
// [END iot_mqtt_jwt]

// [START iot_mqtt_run]
// The mqttClientId is a unique string that identifies this device. For Google
// Cloud IoT Core, it must be in the format below.
const mqttClientId = `projects/${argv.projectId}/locations/${argv.cloudRegion}/registries/${argv.registryId}/devices/${
	argv.deviceId
}`;

// With Google Cloud IoT Core, the username field is ignored, however it must be
// non-empty. The password field is used to transmit a JWT to authorize the
// device. The "mqtts" protocol causes the library to connect using SSL, which
// is required for Cloud IoT Core.
let connectionArgs = {
	host: argv.mqttBridgeHostname,
	port: argv.mqttBridgePort,
	clientId: mqttClientId,
	username: 'unused',
	password: createJwt(argv.projectId, argv.privateKeyFile, argv.algorithm),
	protocol: 'mqtts',
	secureProtocol: 'TLSv1_2_method',
};

// Create a client, and connect to the Google MQTT bridge.
let iatTime = parseInt(Date.now() / 1000);
let client;

function connect() {
	client = mqtt.connect(connectionArgs);

	// Subscribe to the /devices/{device-id}/config topic to receive config updates.
	client.subscribe(`/devices/${argv.deviceId}/config`, { qos: 1 });

	// The MQTT topic that this device will publish data to. The MQTT
	// topic name is required to be in the format below. The topic name must end in
	// 'state' to publish state and 'events' to publish telemetry. Note that this is
	// not the same as the device registry's Cloud Pub/Sub topic.

	client.on('connect', success => {
		console.log('connect');
		if (!success) {
			console.log('Client not connected...');
		}
	});

	client.on('close', () => {
		console.log('close');
	});

	client.on('error', err => {
		console.log('error', err);
	});

	client.on('message', (topic, message, packet) => {
		console.log('message received: ', Buffer.from(message, 'base64').toString('ascii'));
	});

	client.on('packetsend', packet => {
		// Note: logging packet send is very verbose
	});
}

async function publishPickCandy(command) {
	const mqttTopic = `/devices/${argv.deviceId}/${argv.messageType}/candy`;
	try {
		// [START iot_mqtt_jwt_refresh]
		let secsFromIssue = parseInt(Date.now() / 1000) - iatTime;
		if (secsFromIssue > argv.tokenExpMins * 60) {
			iatTime = parseInt(Date.now() / 1000);
			console.log(`\tRefreshing token after ${secsFromIssue} seconds.`);
			client.end();

			connectionArgs.password = createJwt(argv.projectId, argv.privateKeyFile, argv.algorithm);
			connectionArgs.protocolId = 'MQTT';
			connectionArgs.protocolVersion = 4;
			connectionArgs.clean = true;

			client = mqtt.connect(connectionArgs);

			client.on('connect', async (success) => {
				console.log('connect');
				if (!success) {
					console.log('Client not connected...');
				} else {
					await client.publish(mqttTopic, command, { qos: 1 });
				}
			});
			
			client.on('close', () => {
				console.log('close');
				shouldBackoff = true;
			});

			client.on('error', err => {
				console.log('error', err);
			});

			client.on('message', (topic, message, packet) => {
				console.log('message received: ', Buffer.from(message, 'base64').toString('ascii'));
			});

			client.on('packetsend', () => {
				// Note: logging packet send is very verbose
			});
			return;
		}
		await client.publish(mqttTopic, command, { qos: 1 });
	} catch (e) {
		console.log(e.stack);
	}
}

// Once all of the messages have been published, the connection to Google Cloud
// IoT will be closed and the process will exit. See the publishAsync method.
// [END iot_mqtt_run]

export default {
	client,
	connect,
	publishPickCandy,
};
