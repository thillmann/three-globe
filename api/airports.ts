import airports from "../src/data/airports.json";

export const config = {
  runtime: "edge",
};

export default () => {
  return new Response(JSON.stringify(airports), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};
