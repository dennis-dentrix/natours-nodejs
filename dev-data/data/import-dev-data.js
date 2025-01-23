const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB Connection success'));

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

console.log(Tour);
const importData = async () => {
  try {
    await Tour.create(toursData);
    console.log('Data Loaded');
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted');
  } catch (error) {
    console.log(error);
  }
};

// deleteData();
importData();
