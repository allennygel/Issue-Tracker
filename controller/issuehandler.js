function issuehandler() {
  
 this.submitIssue = function(body) {
   const newIssue = {
        issue_title: body.issue_title,
        issue_text: body.issue_text,
        created_by: body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: body.assigned_to || "",
        status_text: body.status_text || "",
        open: true,    
  }
   return newIssue
 }
  
this.getIssue = function(query) {
 let findIssue = Object.keys(query).reduce((acc, cur) => {
    if(query[cur] !== '') {acc[cur] = query[cur]}
    return acc
   }, {});
  
 if(findIssue.open == 'false' ) findIssue.open = false;
 if(findIssue.open == 'open' ) findIssue.open = true;
 
  
  return findIssue
 }
  
this.updateIssue = function(body) {
 let updatedIssue = Object.keys(body).reduce(function(obj, k) {
   if (body[k] !== '' && k !== '_id') obj[k] = body[k];
     return obj;
  }, {});
    
  if (updatedIssue.open === 'false') updatedIssue.open = false;
  if (updatedIssue.open === 'true') updatedIssue.open = true;
      
  if (Object.keys(updatedIssue).length > 0) updatedIssue.updated_on = new Date();
 
  return updatedIssue 
 
 }
  
}

module.exports = issuehandler