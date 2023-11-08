const verifyUserId = (req, res, next) => {
  const userId = req.cookies('id');
  const currentUserId = req.params.user_id;
  if (userId === currentUserId) {
    next();
  } else {
    res.status(409).json({ success: false, message: 'User not authenticated' });
  }
};

export default verifyUserId;
