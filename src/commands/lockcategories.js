const { getLockCategories, responseHandler, TIMEOUT } = require("../util/min-api.js");
const { formatLockCategories, emptyVideoEmbed } = require("../util/formatResponse.js");
const { findVideoID } = require("../util/validation.js");
const { hideOption, videoIDRequired, actionTypeOption, findOption } = require("../util/commandOptions.js");
const { timeoutResponse, invalidVideoID } = require("../util/invalidResponse.js");
const { embedResponse, contentResponse } = require("../util/discordResponse.js");

module.exports = {
  name: "lockcategories",
  description: "Retrieve video lock categories",
  options: [
    videoIDRequired,
    hideOption,
    actionTypeOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    let videoID = findVideoID(findOption(interaction, "videoid"));
    const hide = findOption(interaction, "hide") ?? false;
    // check for video ID
    const actionType = findOption(interaction, "actiontype") || "";
    if (!videoID) return response(invalidVideoID);
    // setup
    const embed = emptyVideoEmbed(videoID);
    // fetch
    const subreq = await Promise.race([getLockCategories(videoID, actionType), scheduler.wait(TIMEOUT)]);
    const result = await responseHandler(subreq);
    if (result.success) { // no request errors
      return response(embedResponse(formatLockCategories(videoID, result.data), hide));
    } else { // handle error responses
      if (result.error === "timeout") {
        return response(timeoutResponse);
      } else if (result.code === 404 ) {
        embed.fields.push({
          name: "Locked Categories",
          value: "None"
        });
        return response(embedResponse(embed, hide));
      } else {
        return response(contentResponse(result.error));
      }
    }
  }
};
