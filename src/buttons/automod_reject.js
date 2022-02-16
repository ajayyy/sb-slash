const { sendAutoMod } = require("../util/automod.js");

module.exports = {
  name: "automod_reject",
  execute: async ({ interaction, response }) => {
    const doneVideoID = interaction.message.embeds[0].title;
    const aiRecommends = await XENOVA_ML.get(doneVideoID);
    if (aiRecommends) {
      XENOVA_ML_REJECT.put(doneVideoID, aiRecommends);
    }
    XENOVA_ML.delete(doneVideoID);
    const message = await sendAutoMod();
    return response(message);
  }
};