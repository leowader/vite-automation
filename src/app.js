import express from "express";

export const app = express();
import { Octokit } from "@octokit/rest";
import axios from "axios";
import cors from "cors";
import { crearRepo } from "./module/libs/CreateRepository.js";
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (__req, res) => {
  res.send({ message: "Ok" });
});
app.get("/login", (_req, res) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = `http://localhost:4000/home`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  res.redirect(githubAuthUrl);
});
app.get("/home", async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    const accessToken = response.data.access_token;
    const octokit = new Octokit({ auth: accessToken });
    const { data: userInfo } = await octokit.request("/user");
    const user=JSON.stringify(userInfo)
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <body>
   <script>
   window.opener.postMessage(${user},'http://localhost:5173')
   </script> 
        
    </body>
    </html>`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/create-repo", async (req, res) => {
  const { repoName, accessToken } = req.body;
  if (!repoName || !accessToken) {
    return res
      .status(400)
      .json({ error: "repoName and accessToken are required" });
  }
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const octokit = new Octokit({ auth: accessToken });
  try {
    const respuesta = await crearRepo(repoName, octokit);
    res.send({ data: respuesta });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ error: error.message });
  }
});