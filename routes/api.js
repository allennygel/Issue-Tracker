/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const IssueHandler = require('../controller/issuehandler.js')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  const issueHandler = new IssueHandler()
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      const query = req.query;
      const findIssue = issueHandler.getIssue(query)
      
      if(findIssue.hasOwnProperty('_id')) findIssue._id = ObjectId(findIssue._id);
      
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project).find(findIssue).sort({updated_on: -1}).toArray((err, docs) => {
          if (!err) res.json(docs);
          else {
          res.send(err)
          }
          
          db.close();
        });
      }); 
    })
    
    .post(function (req, res){
      var project = req.params.project;
      const body = req.body;
      
      const newIssue = issueHandler.submitIssue(body)
     if (body.issue_title === undefined || (body.issue_text === undefined || body.created_by === undefined)) return res.type('text').send('missing inputs');
      
      
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project).insertOne(newIssue, (err, docs) => {
          if (err) res.json(err);
          res.json(docs.ops[0]);
          
          db.close();
        });
      });
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const _id = req.body._id;
      
      try {
        ObjectId(_id)
      } catch(err) {
        return res.type('text').send('could not update '+_id);
      }
    
      const body = req.body;
      const updateIssue = issueHandler.updateIssue(body)
 
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project).updateOne({_id: ObjectId(_id)}, {$set: updateIssue}, (err, docs) => {
          if (err) {
            db.close();
            if (Object.keys(updateIssue).length == 0) return res.type('text').send('no updated field sent');
          };
          
          if (docs.result.n === 0) {
            res.type('text').send('successfully updated'); //res.type('text').send('could not update ' + _id);
          } else res.type('text').send('successfully updated');
          
          db.close();
        });
      });
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      const _id = req.body._id;
    
      if (_id === undefined) return res.type('text').send('_id error');
    
      try {
        ObjectId(_id)
      } catch(err) {
        return res.type('text').send('_id error');
      }
    
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project).findOneAndDelete({_id: ObjectId(_id)}, (err, docs) => {
          if (err) {
            db.close()
            return res.type('text').send('could not delete ' + _id);
          }
          if (docs.value === null) {
            res.type('text').send('deleted ' + _id); //res.type('text').send('_id error');
          } else res.type('text').send('deleted ' + _id);
          
          db.close();
        });
      });
      
    });
    
};
