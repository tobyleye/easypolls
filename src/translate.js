module.exports = (text, target) => {
  let formdata = new FormData();
  let body = {
    q: `=${text}`,
    source: "english",
    target: target,
    format: "text",
    api_key: "",
    secret: "LUKFI2N",
  };

  for (let key in body) {
    formdata.append(key, body[key]);
  }
  return fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: {
      "content-type": "multipart/form-data",
      //   cookie: "session=ceb0fdd3-fdd0-4181-926b-d10ebbf2148c",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0",
    },
    body: formdata,
  }).then((res) => res.json());
};

// didn't work!!
