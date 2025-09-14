import fetch from "node-fetch";
import fs from "fs";

// GitHub GraphQL API endpoint
const API_URL = "https://api.github.com/graphql";

// Your username
const USERNAME = "Vandana-Ss";

// GraphQL query to get merged PRs
const query = `
{
  user(login: "${USERNAME}") {
    pullRequests(states: MERGED) {
      totalCount
    }
  }
}
`;

async function fetchMergedPRs() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `bearer ${process.env.GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const mergedCount = data.data.user.pullRequests.totalCount;

  // Save JSON for Shields.io
  const output = { merged_prs: mergedCount };
  fs.writeFileSync("merged-prs.json", JSON.stringify(output));

  console.log("Merged PRs:", mergedCount);
}

fetchMergedPRs().catch((err) => {
  console.error("Error fetching merged PRs:", err);
  process.exit(1);
});
