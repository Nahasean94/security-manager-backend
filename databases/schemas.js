'use strict'

/**
 *
 * This file contains the schemas (tables) that will be used to store various data
 */
//import the mongoose library to help us create javascript objects which are used to define schemas and also hold various data types
const mongoose = require('mongoose')

/**
 *
 * In mongoose, a schema represents the structure of a particular document, either completely or just a portion of the document. It's a way to express expected properties and values as well as constraints and indexes. A model defines a programming interface for interacting with the database (read, insert, update, etc). So a schema answers "what will the data in this collection look like?" and a model provides functionality like "Are there any records matching this query?" or "Add a new document to the collection".

 In straight RDBMS, the schema is implemented by DDL statements (create table, alter table, etc), whereas there's no direct concept of a model, just SQL statements that can do highly flexible queries (select statements) as well as basic insert, update, delete operations.

 Another way to think of it is the nature of SQL allows you to define a "model" for each query by selecting only particular fields as well as joining records from related tables together.

 *
 */
//declare the Schema object. Each Schema object represents the equivalent of table in mysql
const Schema = mongoose.Schema

//create the Person Schema (Person table)
const PersonSchema = new Schema({
    employee_id: String,
    email: {
        type: String,
        unique: [true, "email already exists"],
    },
    first_name: {
        type: String,
        required: [true, 'Password is a required field']
    },
    last_name: {
        type: String,
        required: [true, 'Password is a required field']
    },
    password: {
        type: String,
        required: [true, 'Password is a required field']
    },
    profile_picture: String,
    address: String,
    cellphone: {
        type: Number,
        required: ['cellphone is a required field']
    },
    timestamp: Date,

})
const AdminSchema = new Schema({
    email: {
        type: String,
        unique: [true, "email already exists"],
    },
    password: {
        type: String,
        required: [true, 'Password is a required field']
    },
    profile_picture: String,
    timestamp: Date,

})
const SalarySchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: [true, 'employee_id is required']
    },
    gross_salary: {
        type: Number,
        required: [true, "how much is this employee being paid?"]
    },
    deductions: [{
        name: String,
        amount: Number
    }],
    payment: {
        type: String,
        required: [true, "is this a daily, weekly or monthly paid employee?"],
        enum: ['month', 'week', 'day'],
        default: 'month'
    },
    transactions: [{
        timestamp: Date,
        amount: Number,
        text: String
    }]
})
const AttendanceRegisterSchema = new Schema({
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: [true, 'employee_id is required']
    },
    signin: {
        type: Number,
        required: [true, "how much is this employee being paid?"]
    },
    signout: [{
        name: String,
        amount: Number
    }],
    date: {
        type: Date,
        required: [true, "date is a required field"]
    },
})

const LocationSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is a required field"],
        unique: [true, "A location with that name already exists"],
    },
    timestamp: Date
})
const MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: [true, 'employee_id is required']
    },
    replies: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Person',
            required: [true, 'employee_id is required']
        },
        body: {
            type: String,
            required: ['body must not be empty']
        },
        timestamp: Date
    }],
    timestamp: Date
})

/**
 *
 * Create models from the above schemas.
 */
const Person = mongoose.model('Person', PersonSchema)
const Admin = mongoose.model('Admin', AdminSchema)
const Salary = mongoose.model('Salary', SalarySchema)
const Message = mongoose.model('Message', MessageSchema)
const Location = mongoose.model('Location', LocationSchema)
const AttendanceRegister = mongoose.model('AttendanceRegister', AttendanceRegisterSchema)

//export the above models to used in other files
module.exports = {
    Person, Salary, Message, AttendanceRegister, Location,Admin
}