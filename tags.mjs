import * as dotenv from "dotenv";
dotenv.config();

const headers = {
  Authorization:
    "BASIC " +
    Buffer.from(process.env.TEAMWORK_KEY + ":xxx").toString("base64"),
  "Content-Type": "application/json",
};

try {
  let res = await fetch("https://projects.arcticleaf.io/tags.json", {
    method: "GET",
    headers,
  });

  const tags = await res.json();
  let totalDash = 0;
  let totalBrown = 0;
  for (let tag of tags.tags) {
    if (tag.name.startsWith("-")) {
      console.log(tag);
      totalDash++;
    }
    if (tag.color === "#9e6957") {
      console.log(tag);
      totalBrown++;
    }
  }

  console.log(totalDash);
  console.log(totalBrown);
} catch (err) {
  console.log(err);
}
