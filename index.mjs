import * as dotenv from "dotenv";
dotenv.config();

const headers = {
  Authorization:
    "BASIC " +
    Buffer.from(process.env.TEAMWORK_KEY + ":xxx").toString("base64"),
  "Content-Type": "application/json",
};

try {
  let resultLength = 500;
  let timers = [];
  let page = 1;

  while (page < 2 && resultLength === 500) {
    let res = await fetch(
      `https://projects.arcticleaf.io/time_entries.json?page=${page}&pageSize=500&fromdate=20200101&tagIds=90060`,
      {
        method: "GET",
        headers,
      }
    );
    const results = await res.json();
    timers = timers.concat(results["time-entries"]);
    resultLength = results["time-entries"].length;
    page++;
  }

  const alreadyCompedTags = [
    "-comp",
    "-review",
    "-writeoff",
    "-meeting",
    "-training",
    "-research",
    "-qbr",
  ];

  const compTag = {
    projectId: 0,
    name: "-comp",
    color: "#9e6957",
  };

  const timersToUpdate = [];

  for (let timer of timers) {
    timer.tags = timer.tags
      .filter((t) => t.name !== "-pm")
      .map((t) => {
        return {
          name: t.name,
          color: t.color,
          projectId: t["project-id"] ? parseInt(t["project-id"]) : 0,
        };
      });
    if (!timer.tags.some((t) => alreadyCompedTags.includes(t.name))) {
      timer.tags.push(compTag);
    }
    timersToUpdate.push(timer);
  }

  let count = 0;
  for (let timer of timersToUpdate) {
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch(
      `https://projects.arcticleaf.io/projects/api/v3/time/${timer.id}.json`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          tags: timer.tags,
        }),
      }
    );
    const json = await res.json();
    count++;
    console.log(
      `Response: ${res.status}\nResponse Error: ${
        json.errors ? json.errors[0].detail : "N/A"
      }\nProgress: ${count}/${timersToUpdate.length} timers updated.`
    );
  }
} catch (err) {
  console.log(err);
}
