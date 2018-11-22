## Candy Picker Backend - Junction 2018

The main technologies used in this project:
- [Node.js]
- [Koa framework](https://koajs.com/)
- [Google Cloud IoT core - Using the MQTT Bridge](https://cloud.google.com/iot/docs/how-tos/mqtt-bridge)
- [Google Cloud IoT core - End to End example](https://cloud.google.com/iot/docs/samples/end-to-end-sample)


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
[http://localhost:5050](http://localhost:5050).

### `yarn build`

Builds the app for production to the `build` folder.<br>

### `yarn dep`

Deploy project

## How to deploy to Google Cloud

- [Set up Google Cloud Local Env](https://cloud.google.com/appengine/docs/standard/python/quickstart)
- Run `yarn dep`. In this project, `yarn dep` will run ./release.sh. You should have you candy-picker-front-end and candy-picker-backend in same level. Run `yarn build` in candy-picker-front-end project firstly. Then, in candy-picker-backend project, run `yarn dep`
- In .env file of candy-picker-backend project, you need to config your own Google Cloud Project variables.
- If you use other programming lanugages, you also need to config app.yaml.
