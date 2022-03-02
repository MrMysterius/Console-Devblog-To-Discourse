import { logger } from ".";
import { post } from "./post";

export class Queue {
  items: Post[];
  interval_id: any;

  constructor() {
    this.items = [];
  }

  private tick(queue: Queue, count: number) {
    if (count >= 5) return;

    logger.silly(queue);
    logger.debug("Queue Tick");

    if (queue.items.length == 0) {
      queue.interval_id = setTimeout(queue.tick, 60000, queue, count++);
      return;
    }

    logger.debug("Queue Post");
    post(queue.items.pop() as Post);
    queue.interval_id = setTimeout(queue.tick, 1000, queue, 0);
  }

  add(post: Post) {
    this.items.push(post);
  }

  run() {
    console.log(this.items.length);
    this.interval_id = setTimeout(this.tick, 10000, this, 0);
  }
}
