module.exports = function svcCity(opts) {
    const { sequelizeCon, mdlFcm, firebase, cloudinary } = opts;

    const { FCM } = mdlFcm;

    const sendNotifications = async (tokensList, data) => {
        const message = {
            notification: {
                title: data.title,
                body: data.msg,
                image: data.image
            },
            tokens: tokensList,
        };

        return firebase
            .messaging()
            .sendMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(tokensList[idx]);
                        }
                    });
                    console.log("tokens failed!", failedTokens)
                    // logger.info("Notification failed to send to tokens:", failedTokens);
                } else {
                    console.log("Notification sent successfully to all tokens.");
                }
            })
            .catch((error) => {
                console.log("Error sending notification:", error);
            });
    };

    const sendNotificationsInChunks = (
        tokensArray,
        chunkSize,
        data
    ) => {
        const chunks = [];
        for (let i = 0; i < tokensArray.length; i += chunkSize) {
            const chunk = tokensArray.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        chunks.forEach((chunk, index) => {
            setTimeout(() => {
                // console.log("Sending chunk", index + 1, "of tokens:", chunk);
                sendNotifications(chunk, data);
            }, index * 2000);
        });
    };

    async function sendNotification(body) {
        try {
            if (body?.image !== null || body?.image !== "") {
                const { secure_url } = await cloudinary.v2.uploader.upload(body.image);
                body["image"] = secure_url;
            }
            const tokens = await FCM.findAll({
                attributes: ["token"],
                where: { role: "user" },
                raw: true
            })
            const chunkSize = 500;
            const tokensList = tokens.map((x) => x.token);
            if (tokensList && tokensList.length > 0)
                sendNotificationsInChunks(
                    tokensList,
                    chunkSize,
                    body
                );

            return "Sent Successfully!";
        } catch (e) {
            console.log(e);
        }
    }
    return {
        sendNotification,
    };
};
