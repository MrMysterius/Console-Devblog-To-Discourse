import { logger, post_queue } from ".";

import { XMLParser } from "fast-xml-parser";
import { default as axios } from "axios";
import { post } from "./post";

const xml_parser = new XMLParser();
const last = {
  tool: "-",
  beta: "-",
};

export async function check(skip_posting: boolean = false) {
  logger.info("Checking RSS Feeds");

  const res_rss_tools = await axios.get("https://console.dev/tools/rss.xml");
  const res_rss_betas = await axios.get("https://console.dev/betas/rss.xml");

  const rss_tools: RSSFeed = xml_parser.parse(res_rss_tools.data);
  const rss_betas: RSSFeed = xml_parser.parse(res_rss_betas.data);

  const tools = rss_tools.rss.channel.item;
  const betas = rss_betas.rss.channel.item;

  tools.forEach(pubDateFormating);
  betas.forEach(pubDateFormating);

  tools.sort((a, b) => parseInt(b.pubDate) - parseInt(a.pubDate));
  betas.sort((a, b) => parseInt(b.pubDate) - parseInt(a.pubDate));

  if (!skip_posting) {
    for (const tool of tools) {
      if (tool.title == last.tool) break;
      const new_post: Post = {
        title: `[CONSOLE - TOOL] ${tool.title} - ${tool.description}`,
        category: parseInt(process.env.DISCOURSE_CATEGORY_ID || "0") || 1,
        raw: `${tool["content:encoded"]}\n\n${tool.guid}`,
      };

      post_queue.add(new_post);
    }

    for (const beta of betas) {
      if (beta.title == last.beta) break;
      const new_post: Post = {
        title: `[CONSOLE - BETA] ${beta.title} - ${beta.description}`,
        category: parseInt(process.env.DISCOURSE_CATEGORY_ID || "0") || 1,
        raw: `${beta["content:encoded"]}\n\n${beta.guid}`,
      };

      post_queue.add(new_post);
    }
  }

  last.tool = tools[0].title;
  last.beta = betas[0].title;

  post_queue.run();
}

function pubDateFormating(value: RSSItem) {
  value.pubDate = value.pubDate.replace("&#43;", "+");
  const timestamp = Date.parse(value.pubDate);
  value.pubDate = timestamp.toString();
}
