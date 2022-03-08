# Clone of Happy Cow website 🐄 | backend

[<img src="https://img.shields.io/badge/last%20updated-march%202022-yellow">](https://img.shields.io/badge/last%20updated-march%202022-yellow)

Backend for the clone of the [Happy Cow website](https://www.happycow.net/) developped with Node Js and Express, connected to a [client](https://github.com/Emlych/happy-cow-clone-front) bootstrapped with the React Library. <br>
Deployed on Heroku.

⚠️ As it is only a clone, data are not up to date and are localised in Paris and its suburbs.

## Features

✔️ Authentication system using middleware and Mongoose model<br>
✔️ Handle favorites (create, read and add)<br>

## Dependencies

- express
- express-formidable
- mongoose
- cors
- crypto-js
- uid2

## Future features to work on

- Update / delete user
- Generate random password for user if asked

## How to install and run the project

Clone this repository :

`git clone https://github.com/Emlych/happy-cow-clone-back`

`cd happy-cow-clone-client`

Install dependencies :

`npm install`

When installation is complete, run :

`npx nodemon server.js`
