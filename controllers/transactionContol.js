const transactionModel = require('../models/transactionModel')
const dayjs = require('dayjs')

const getAllTransaction = async (req, res) => {  
    try {  
        const { frequency,selectedDate, type } = req.body;  

        const transactions = await transactionModel.find({
            ...(frequency !== 'custom' ? {
                 date: {  
                $gt: dayjs().subtract(Number(frequency), 'days').toDate()
            } 
            }:
            {
                date:{
                    $gte : selectedDate[0],
                    $lte : selectedDate[1]
                }
            }) , 
            userid: req.body.userid  ,
            ...(type !== 'all' && {type})
        });  
        res.status(200).json(transactions);
    } catch (error) {  
        console.log(error);  
        res.status(500).json(error);  
    }  
};

const deleteTransaction = async (req,res) => {
   try{
     await transactionModel.findOneAndDelete({_id:req.body.transactionid})
     res.status(200).send('Transaction Deleted')
   } catch (error) {
    console.log(error);
    res.status(500).json(error);
   }
}

const editTransaction = async (req,res) => {
    try {
       if (!req.body.transactionId) {
          return res.status(400).send('Transaction ID is required');
       }
       const result = await transactionModel.findOneAndUpdate(
          {_id: req.body.transactionId},
          req.body.payload,
       );
       if (!result) {
          return res.status(404).send('Transaction not found');
       }
       res.status(200).send('Edit Successful');
    } catch (error) {
       console.log(error);
       res.status(500).json(error);
    }
 }

const addTransaction = async (req,res) => {
   try{
        const newTransaction = new transactionModel(req.body)
        await newTransaction.save()
        res.status(201).send('Transaction Created')
   }catch(error){
        console.log(error);
        res.status(500).json(error);
   }
}

module.exports = {getAllTransaction , addTransaction ,editTransaction , deleteTransaction};