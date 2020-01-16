<p align="center">
  <img src="./src/assets/logo_gif.gif" />
</p>

<p align="center">
  <b>Yodelay.io </b> is a browser-based testing tool that supports all types of gRPC calls: unary, server streaming, client streaming and bi-directional streaming, and aims to provide a beautiful interface and intuitive developer experience
</p>

## Core Features ✨

- Unary Calls and Server Side Streaming Support
- Client side and Bi-directional Streaming
- Automatic gRPC Service & Method recognition
- Request Cancellation

## Planned Features 🚧

- [ ] Web Version with gRPC-WEB
- [ ] Persistent Workspace
- [ ] Electron App
- [ ] Search History

## Getting Started 🚀

For an overview of gRPC in general, checkout the official [DOCS](https://grpc.io/docs/) here. There are clear and simple walkthroughs for each of the 12 programming languages supported by gRPC. Butter, Yodelay’s furry mascot, recommends choosing your preferred language, uploading the .proto file into yodelay and then using those examples to walk through this readme.

## Installation ⚙

Fork and clone this repo:

```sh
git clone https://github.com/<yourgithubhandle>/Yodelay.git
```

```sh
cd Yodelay
```

```sh
npm install
```
<p align="center">
  <img src="https://media.giphy.com/media/kBSlhxKc4xkSQcGk3x/giphy.gif" />
</p>

### Test your endpoints locally ☄

Navigate to the Yodelay folder in your terminal and run the following command:

```sh
npm start
```

NPM start will build the bundle, make it available in your browser at localhost:3000, start the client server on port 4000, and start a demo grpc server at localhost:8080
<p align="center">
  <img src="https://media.giphy.com/media/hU4Vzx4IbuIo8ps6A8/giphy.gif" />
</p>
Go to your browser and enter the URL:

```sh
0.0.0.0:8080
```

To test our demo proto file, upload the demo.proto file in the /protos folder

Input the server ip address:

```sh
0.0.0.0:8080
```

Select Service from the drop down you want to test:

Select Request from the drop down menu you want to test:

Edit your input message so it matches the gRPC server fields:

Click on the Send Request button and see the results from your gRPC call!

<p align="center">
  <img src="https://media.giphy.com/media/hW9ui8UcGlfVXI31hY/giphy.gif" />
</p>

## Contributing ✏️👩‍💻👨‍💻📓

We have an open door policy - all ideas, feedback, and contributions are always welcome!
Note - When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Built with 💛

- Cedric Theofanous - <a href="https://github.com/CedricTheofanous">@CedricTheofanous</a>
- Davey Yedid - <a href="https://github.com/dYedid">@dYedid</a>
- Jamie Highsmith - <a href="https://github.com/JamesHighsmith">@JamesHighsmith</a>
- German Rovati - <a href="https://github.com/grovati">@grovati</a>
- Tammy Tan - <a href="https://github.com/tammytan95">@tammytan95</a>

## Developed using amazing technologies ⚛ 🐳🚢

  <p float="left">
    <img src="./src/assets/technologies.png" width="600"/>
  </p>

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
