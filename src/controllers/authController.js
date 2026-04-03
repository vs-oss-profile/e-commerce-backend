const authService = require("../services/authService");

async function login(req, res) {
  const credentials = req.body;
  const data = await authService.login(credentials);

  res.cookie("refresh_token", data.refresh_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    path: "/auth/refresh",
  });
  return res.json({
    success: true,
    data: { access_token: data.access_token },
  });
}

async function signupCustomer(req, res) {
  const info = req.body;
  const result = await authService.signup(info);

  res.cookie("refresh_token", result.refresh_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    path: "/auth/refresh",
  });
  return res.status(201).json({
    success: true,
    data: { access_token: result.access_token },
  });
}

async function refresh(req, res) {
  const oldRefreshToken = req.cookies?.refresh_token;

  if (!oldRefreshToken) {
    res.clearCookie("refresh_token", {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });
    return res.json({
      success: false,
      message: "Refresh token not provided",
    });
  }

  try {
    const tokens = await authService.refresh(oldRefreshToken);

    res.cookie("refresh_token", tokens.refresh_token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });
    return res.json({
      success: true,
      data: { access_token: tokens.access_token },
    });
  } catch (err) {
    res.clearCookie("refresh_token", {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });

    if (err.status === 401) {
      return res.json({
        success: false,
        message: "Token reuse detected",
      });
    } else if (err.status === 400) {
      return res.json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    throw err;
  }
}

module.exports = { login, signupCustomer, refresh };
