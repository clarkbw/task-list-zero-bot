module.exports = robot => {
  robot.on(
    [
      "pull_request.opened",
      "pull_request.edited",
      "pull_request.synchronize",
      "pull_request.reopened"
    ],
    context => {
      const title = context.payload.pull_request.title;
      const body = context.payload.pull_request.body;
      const isUnChecked = /-\s\[\s\]/g.test(body);
      const status = isUnChecked ? "pending" : "success";

      robot.log(
        `Updating PR "${title}" (${context.payload.pull_request
          .html_url}): ${status}`
      );

      context.github.repos.createStatus(
        context.repo({
          sha: context.payload.pull_request.head.sha,
          state: status,
          target_url: "https://github.com/settings/apps/task-list-zero",
          description: status
            ? "task list not completed yet"
            : "ready for the next steps",
          context: "Task List Zero"
        })
      );
    }
  );
};
