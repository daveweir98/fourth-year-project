DROP DATABASE IF EXISTS car_damage;

CREATE DATABASE car_damage;

USE car_damage;

SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

CREATE TABLE car (
  car_registration varchar(255),
  make varchar(255),
  model varchar(255),
  PRIMARY KEY(car_registration)
);

CREATE TABLE images (
  images_id int NOT NULL AUTO_INCREMENT,
  front varchar(255),
  back varchar(255),
  left_side varchar(255),
  right_side varchar(255),
  PRIMARY KEY(images_id)
);

CREATE TABLE appraisals (
  appraisal_id int AUTO_INCREMENT,
  car_registration varchar(255),
  images_id int,
  rental_date MEDIUMTEXT,
  return_date MEDIUMTEXT,
  appraisal_complete boolean,
  damage_present boolean DEFAULT 1,
  PRIMARY KEY(appraisal_id),
  FOREIGN KEY (car_registration) REFERENCES car (car_registration),
  FOREIGN KEY (images_id) REFERENCES images (images_id)
);
