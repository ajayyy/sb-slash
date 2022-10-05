const response = (hide) => {
  return {
    type: 4,
    data: {
      flags: (hide ? 64 : 0)
    }
  };
};

const embedResponse = (embed, hide = true) => {
  const result = response(hide);
  result.data.embeds = [embed];
  return result;
};

const contentResponse = (content, hide = true) => {
  const result = response(hide);
  result.data.content = content;
  return result;
};

const pingResponse = (content, hide = true, ping = false) => {
  const result = response(hide);
  if (!ping) {
    result.data.allowed_mentions = {
      parse: []
    };
  }
  result.data.content = content;
  return result;
};

const componentResponse = (embed, components, hide = true) => {
  const result = response(hide);
  result.data.embeds = [embed];
  result.data.components = components;
  return result;
};

module.exports = {
  embedResponse,
  contentResponse,
  pingResponse,
  componentResponse
};
