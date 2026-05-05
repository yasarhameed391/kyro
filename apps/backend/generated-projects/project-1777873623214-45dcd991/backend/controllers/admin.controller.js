exports.getDashboard = (req, res) => {
  res.json({ message: 'Admin Dashboard', user: req.user });
};

exports.getUsers = (req, res) => {
  res.json({ users: [] });
};

exports.getStats = (req, res) => {
  res.json({ totalUsers: 0, totalOrders: 0 });
};
