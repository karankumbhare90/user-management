const Customer = require('../models/Customer');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

// Template
// GET : Home Page
/*
exports.homepage = async(req, res) =>{

    const messages = await req.flash('info');
    const locals = {
        title : 'NodeJS',
        description : 'Free NodeJS User Management System'
    }

    try {
        Customer.find({}).limit(20).then(customers => {
            // Pass the customers array to the render function
            res.render('index', { locals, messages, customers });
        }).catch(error => {
            console.error(error);
            // Handle error
            res.status(500).send('Internal Server Error');
        });
    } catch (error) {
        console.log(error);
    }
}
*/


// GET : Home Page
// Pagination
exports.homepage = async (req, res) => {

    const messages = await req.flash('info');
    const locals = {
        title: 'NodeJS',
        description: 'Free NodeJS User Management System'
    }

    const perPage = 10;
    const page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Customer.countDocuments();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });
    } catch (error) {
        console.log(error);
    }
}

// GET : About Page
exports.aboutpage = async (req, res) => {

    const messages = await req.flash('info');
    const locals = {
        title: 'About Page',
        description: 'Free NodeJS User Management System'
    }

    try {
        res.render('about', {
            locals,
            messages
        });
    } catch (error) {
        console.log(error);
    }
}


// GET : Add New Customer
exports.addCustomer = async (req, res) => {
    const locals = {
        title: 'Add New Customer - NodeJS',
        description: 'Free NodeJS User Management System'
    }

    res.render('customer/add', locals);
}

// POST : Add New Customer
exports.postCustomer = async (req, res) => {

    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        contactNo: req.body.contactNo,
        email: req.body.email,
    });

    try {
        await Customer.create(newCustomer);
        req.flash('info', 'New Customer Has Been Added');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

}

exports.viewCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'View Customer Data - NodeJS',
            description: 'Free NodeJS User Management System'
        };

        res.render('customer/view2', {
            locals,
            customer,
        })
    }
    catch (err) {
        console.log(err);
    }
}

exports.editDetails = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'View Customer Data - NodeJS',
            description: 'Free NodeJS User Management System'
        };

        res.render('customer/edit', {
            locals,
            customer,
        })
    }
    catch (err) {
        console.log(err);
    }
}

/** PUT - Update Customer Data */

exports.editCustomer = async (req, res) => {
    try {
        await Customer.findOneAndUpdate({
            _id: req.params.id
        },
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                contactNo: req.body.contactNo,
                email: req.body.email,
                details: req.body.details,
                updatedAt: Date.now()
            });

        res.redirect(`/view2/${req.params.id}`);

    }
    catch (err) {
        console.log(err);
    }
}

// Delete customer Data

exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findOneAndDelete({
            _id: req.params.id
        });

        res.redirect(`/`);

    }
    catch (err) {
        console.log(err);
    }
}

exports.renderGeneratePage = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: 'View Customer Data - NodeJS',
            description: 'Free NodeJS User Management System'
        };
        res.render('customer/generate', {
            locals,
            customer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.generatePdf = async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const inlineStyles = `
            <style>
            .col {
                flex-basis: 0;
                flex-grow: 1;
                max-width: 100%;
            }
            .breadcrumb {
                background-color: #f8f9fa;
                padding: .75rem 1rem;
                margin-bottom: 1rem;
                list-style: none;
                border-radius: .25rem;
            }
            .breadcrumb-item + .breadcrumb-item::before {
                display: inline-block;
                padding-right: .5rem;
                padding-left: .5rem;
                color: #6c757d;
                content: "/";
            }
            .list-group-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: .75rem 1.25rem;
                margin-bottom: -1px;
                background-color: #fff;
                border: 1px solid rgba(0,0,0,.125);
            }
        </style>
        `;

        // HTML content with customer data and inline styles
        const htmlContent = `
            ${inlineStyles}
            <ul class="list-group">
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Name : </b></div>
                        <div class="col">${customer.firstName} ${customer.lastName}</div>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Contact No : </b></div>
                        <div class="col">${customer.contactNo}</div>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Email : </b></div>
                        <div class="col">${customer.email}</div>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Details : </b></div>
                        <div class="col">${customer.details}</div>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Date created : </b></div>
                        <div class="col">${new Date(customer.createdAt).toUTCString()}</div>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="row">
                        <div class="col"><b>Update : </b></div>
                        <div class="col">${new Date(customer.updatedAt).toUTCString()}</div>
                    </div>
                </li>
            </ul>
        `;

        // Options for pdf generation
        const options = {
            format: 'A4',
            border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        };

        // Generating PDF
        pdf.create(htmlContent, options).toBuffer(function (err, buffer) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error generating PDF' });
            }

            // Sending PDF as response for download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="customer_${customerId}.pdf"`);
            res.send(buffer);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.searchCustomer = async (req, res) => {
    try {

        const locals = {
            title: 'Search Customer Data - NodeJS',
            description: 'Free NodeJS User Management System'
        };

        const searchTerm = req.body.searchTerm;
        const searchNoSpecialCharacter = searchTerm.replaceAll(/[^a-zA-Z0-9 ]/g, "");

        const customer = await Customer.find({
            $or : [
                {firstName : { $regex : new RegExp(searchNoSpecialCharacter, "i")}},
                {lastName : { $regex : new RegExp(searchNoSpecialCharacter, "i")}},
                {contactNo : { $regex : new RegExp(searchNoSpecialCharacter, "i")}},
                {email : { $regex : new RegExp(searchNoSpecialCharacter, "i")}},
            ]
        });

        res.render("search", {
            locals,
            customer
        })
    } catch (error) {
        console.log(error);
    }
}