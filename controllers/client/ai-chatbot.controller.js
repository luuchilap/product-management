// [GET] /ai-chatbot
module.exports.index = async (req, res) => {
    res.render("client/pages/ai-chatbot/index", {
        pageTitle: "AI Chatbot",
    });
};