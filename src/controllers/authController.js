const authService = require("../services/authService");

async function login(req, res) {
  const credentials = req.body;
  const data = await authService.login(credentials);
  res.cookie("refreshToken", data.refreshToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return res.json({
    success: true,
    data,
  });
}

async function signupCustomer(req, res) {
  const info = req.body;
  const result = await authService.signup(info);

  res.cookie("refreshToken", result.refreshToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return res.status(201).json({
    success: true,
    data: result,
  });
}

async function refresh(req, res) {
  const oldRefreshToken = req.cookies?.refreshToken;
  if (!oldRefreshToken) {
    return res.json({
      success: false,
      message: "Refresh token not provided",
    });
  }

  try {
    const tokens = await authService.refresh(oldRefreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });
    return res.json({
      success: true,
      data: tokens,
    });
  } catch (err) {
    if (err.status === 401) {
      res.cookie("refreshToken", "", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
      });
      return res.json({
        success: false,
        message: "Token reuse detected",
      });
    }
    throw err;
  }
}

module.exports = { login, signupCustomer, refresh };
