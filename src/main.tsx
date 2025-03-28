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
    const [directions, setDirections] = useState(0)
    const [webviewVisible, setWebviewVisible] = useState(false);
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
      <vstack grow padding="medium">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
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
          <vstack alignment="center">
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
            <hstack alignment="center">
              <text alignment="center" size="xsmall">How well do you know movies? </text>
              </hstack>
              <hstack>
              <text alignment="center" size="xsmall">   Click the button below to reveal an image of a movie scene. </text>
             </hstack>
             <hstack>
              <text alignment="center" size="xsmall">    Guess the movie title to solve today's challenge! </text>
           </hstack>
            <spacer />
            <spacer />
            <button size="small" icon="play-outline" onPress={() => webView.mount()}>
         Show Scene</button>
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;