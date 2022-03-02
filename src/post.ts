import { default as axios } from "axios";
import { logger } from ".";

export async function post(new_post: Post) {
  if (!process.env.DISCOURSE_URL || !process.env.DISCOURSE_API_KEY || !process.env.DISCOURSE_API_USERNAME) {
    logger.error("Discourse Settings in Environment invalid");
    throw new Error("Discourse Settings in Environment invalid");
  }

  try {
    const res = await axios.post(`${process.env.DISCOURSE_URL}/posts.json`, JSON.stringify(new_post), {
      headers: { "Content-Type": "application/json", "Api-Key": process.env.DISCOURSE_API_KEY, "Api-Username": process.env.DISCOURSE_API_USERNAME },
    });

    if (res.status != 200) {
      logger.error(`Failed Posting - ${res}`);
      return;
    }
    logger.info(`Posted ${new_post.title}`);
    logger.debug(res);
    return;
  } catch (err) {
    logger.error(err);
  }
}
