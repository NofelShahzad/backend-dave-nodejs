const  express = require('express');
const router = express.Router();
// const path = require('path');
const data = {};
data.employees= require('../../data/employees.json');


router.route('/')
    .get((req,res)=>{
        res.json(data.employees);
    })
    .post((req,res)=>{
        data.employees.push({ 
            id: data.employees[data.employees.length-1].id+1,
            ...req.body 
        });
        res.json(data.employees);
    })
    .put((req,res)=>{

        const employee = data.employees.find(employee => employee.id === req.body.id);

        if (!employee) {
            return res.json({"message": "No data Found!"});
        }
    
        if (req.body.firstname || req.body.lastname) {
            if (req.body.firstname) {
                employee.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                employee.lastname = req.body.lastname;
            }
        } else {
            return res.json({"message": "No updates provided!"});
        }
    
        res.json(employee);
        
    })
    .delete((req,res)=>{
        if (!req.body.id) return res.json({"message": "ID is required!"});
    
        const initialLength = data.employees.length;
        data.employees = data.employees.filter(employee => employee.id !== req.body.id);
    
        if (data.employees.length === initialLength) return res.json({"message": "No data Found!"});
    
        res.json({"message": "Employee deleted successfully!", "employees": data.employees});
    });

    router.route('/:id')
        .get((req,res)=>{
            if (!req.params.id) return res.json({"message": "ID is required!"});
            const singleEmployee= data.employees.filter(employee =>  employee.id == req.params.id)[0];

            if (!singleEmployee) return res.json({"message": "No data found!"});
            res.json(singleEmployee);
        });


 
module.exports = router;
