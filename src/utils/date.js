const getToday = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var ddmmyyyy = dd + "/" + mm + "/" + yyyy;
  return ddmmyyyy;
};
module.exports = getToday;
