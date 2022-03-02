declare interface Post {
  title: string;
  raw: string;
  category: number;
}

declare interface RSSFeed {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      image: {
        title: string;
        link: string;
        url: string;
      };
      item: RSSItem[];
    };
  };
}

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  guid: string;
  description: string;
  "content:encoded": string;
}
