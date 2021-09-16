const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { formatUserStats } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserStats } = require("../util/min-api.js");

const userIDRegex = new RegExp(/(?:^|sb.ltn.fi\/userid\/)([a-f0-9]{64})/);
const hasValidUserUUID = (str) => userIDRegex.test(str);

module.exports = {
  type: 1,
  name: "userstats",
  description: "retrieves user statistics",
  options: [
    {
      name: "publicid",
      description: "Public User ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid publicID
    if (!hasValidUserUUID(publicid)) return response(invalidPublicID);
    const userID = publicid.match(userIDRegex)[1];
    // fetch
    const parsedUser = await getUserStats(userID);
    const embed = formatUserStats(userID, parsedUser);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        flags: (hide ? 64 : 0)
      }
    });
  }
};