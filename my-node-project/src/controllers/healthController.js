exports.getHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy and fine working"
  });
};

let users = ['Aman ', 'ji']

exports.getuserlist = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "User list is ready to get and work",
    data: users
  });
  
};


