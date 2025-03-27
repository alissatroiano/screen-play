import './createPost.js';

import { Devvit, useState, useWebView } from '@devvit/public-api';
import type { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Can You Guess What Movie This is From?',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    // Load latest counter from redis with `useAsync` hook
    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      // URL of your web view content
      url: 'page.html',

      // Handle messages sent from the web view
      async onMessage(message, webView) {
        switch (message.type) {
          case 'webViewReady':
            webView.postMessage({
              type: 'initialData',
              data: {
                username: username,
                currentCounter: counter,
              },
            });
            break;
          case 'setCounter':
            await context.redis.set(
              `counter_${context.postId}`,
              message.data.newCounter.toString()
            );
            setCounter(message.data.newCounter);

            webView.postMessage({
              type: 'updateCounter',
              data: {
                currentCounter: message.data.newCounter,
              },
            });
            break;
          default:
            throw new Error(`Unknown message type: ${message satisfies never}`);
        }
      },
      onUnmount() {
        context.ui.showToast('Come Back Soon!');
      },
    });

  // Render the custom post type
  return (
    <vstack grow padding="small">
       <hstack>
          <image
            url="logo.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="250px"
            width="250px"
          />
          </hstack>
          <spacer />
                <text size="xlarge" weight="bold">
Screen Snaps       
</text>
        <spacer />
        <vstack alignment="start middle">
          <hstack>
            <text size="medium">Hey, </text>
            <spacer />
            <text size="medium" weight="bold">
              {' '}
              {username ?? ''}
            </text>
            </hstack>
            <spacer />
            <spacer />
<hstack>
         <text size="small">How well do you know movies?</text>
          </hstack>
        <spacer />
        </vstack>
        <spacer />
        <button onPress={() => webView.mount()}>Reveal Movie Scene</button>
      </vstack>
  );
},
});

export default Devvit;
