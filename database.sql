CREATE DATABASE companydb;

CREATE TABLE company(
    cid SERIAL PRIMARY KEY,
    cin varchar(255),
    company_name varchar(255),
    active BOOLEAN DEFAULT TRUE,
    created TIMESTAMPTZ,
    updated TIMESTAMPTZ
);