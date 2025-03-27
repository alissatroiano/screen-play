import { Devvit } from '@devvit/public-api';

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: 'Guess the movie',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Web View Example',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <hstack>
            <h1>Loading</h1>
          </hstack>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});

Devvit.addMenuItem({
  label: 'Run every day',
  location: 'post',
  onPress: async (_event, context) => {
    const jobId = await context.scheduler.runJob({
      name: 'thing-todo',
      cron: '0 12 * * *',
    });
  },
});