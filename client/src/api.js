const baseURL = import.meta.env.BASE_URL ?? "http://localhost:3005";

export const customFetch = (path, options = {}) => {
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  let url = `${baseURL}/${path}`;

  let body = options.body;
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }
  return fetch(url, {
    ...options,
    body,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  }).then(async (res) => {
    if (!res.ok) {
      let data = await res.json();
      let error = new Error();
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return res.json();
  });
};
