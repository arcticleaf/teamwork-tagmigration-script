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

  while (page < 3 && resultLength === 500) {
    let res = await fetch(
      `https://projects.arcticleaf.io/time_entries.json?tag-ids=90700&page=${page}&pageSize=500&fromdate=20200101&tagIds=90060`,
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

  console.log(timers.length);

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
    id: "61738",
    name: "-comp",
    dateUpdated: "",
    color: "#9e6957",
    dateCreated: "",
  };

  const timersToUpdate = [];

  for (let timer of timers) {
    timer.tags = timer.tags.filter((t) => t.name !== "-pm");
    if (!timer.tags.some((t) => alreadyCompedTags.includes(t.name))) {
      timer.tags.push(compTag);
    }
    timersToUpdate.push(timer);
  }

  for (let timer of timersToUpdate) {
    const tagIds = timer.tags.map((t) => t.id);
    const updatedTimer = { tags: tagIds.toString() };
    console.log(timer);
    console.log(updatedTimer);
    /*
    await fetch(`https://projects.arcticleaf.io/time_entries.json/${timer.id}`, {
      method: "PUT",
      headers,
      body: timer,
    });
    */
  }
} catch (err) {
  console.log(err);
}
